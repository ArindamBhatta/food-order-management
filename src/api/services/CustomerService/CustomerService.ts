import {
  CreateCustomerDTO,
  EditCustomerProfileInputs,
} from "../../dto/interface/Customer.dto";
import ICustomerService from "./CustomerService.interface";
import CustomerRepo from "../../repos/CustomerRepo/CustomerRepo";
import PersonRepo from "../../repos/PersonRepo/PersonRepo";
import FoodRepo from "../../repos/FoodRepo/FoodRepo";
import PersonEntity from "../../entity/PersonEntity";
import CustomerEntity from "../../entity/CustomerEntity";
import {
  generateAccessToken,
  generateSalt,
  hashPassword,
  verifyPassword,
} from "../../utils/auth.utility";
import { GenerateOpt } from "../../utils/OtpValidation.utility";

export default class CustomerService implements ICustomerService {
  private customerRepo: CustomerRepo;
  private personRepo: PersonRepo;
  private foodRepo: FoodRepo;

  constructor(
    customerRepo: CustomerRepo,
    personRepo: PersonRepo,
    foodRepo: FoodRepo
  ) {
    this.customerRepo = customerRepo;
    this.personRepo = personRepo;
    this.foodRepo = foodRepo;
  }

  signUp = async (
    input: CreateCustomerDTO
  ): Promise<{ customer: CustomerEntity; otp: number }> => {
    try {
      const existing = await this.customerRepo.existingCustomer(input.email);
      if (existing) throw new Error("Customer already exists");

      const salt = await generateSalt();
      const hashedPassword = await hashPassword(input.password, salt);
      const { otp, expiry } = GenerateOpt();

      const person = new PersonEntity({
        fullName: input.email.split("@")[0],
        email: input.email,
        phoneNumber: input.phone,
        password: hashedPassword,
        salt: salt,
        otp: otp,
        otpExpiry: expiry,
        verified: false,
      });

      const savedPerson = await this.personRepo.create(person);

      const customer = new CustomerEntity({
        personId: savedPerson.personId,
        isActive: true,
      });

      const savedCustomer = await this.customerRepo.createCustomer(customer);

      return { customer: savedCustomer, otp };
    } catch (error) {
      console.error("Error in CustomerService.signUp:", error);
      throw error;
    }
  };

  verifyOtp = async (
    otp: number,
    email?: string,
    phone?: string,
    customerId?: number
  ) => {
    const customer = await this.customerRepo.verifyOtp(
      otp,
      email,
      phone,
      customerId
    );
    if (!customer || !customer.personId) return { customer: null };

    const person = await this.personRepo.getById(customer.personId);
    if (!person) return { customer: null };

    const signature = generateAccessToken({
      _id: customer.customerId!.toString(),
      email: person.email,
      verified: person.verified,
      role: "customer",
    });
    return { customer, signature };
  };

  signIn = async (password: string, email?: string, phone?: string) => {
    try {
      const customer = await this.customerRepo.existingCustomer(email, phone);
      if (!customer || !customer.personId) return null;

      const person = await this.personRepo.getById(customer.personId);
      if (!person || !person.password || !person.salt) return null;

      const isPasswordValid = await verifyPassword(
        password,
        person.password,
        person.salt
      );
      if (!isPasswordValid) return null;

      const signature = generateAccessToken({
        _id: customer.customerId!.toString(),
        email: person.email,
        verified: person.verified,
        role: "customer",
      });

      return { customer, signature };
    } catch (error) {
      console.error("Error in CustomerService.signIn:", error);
      throw error;
    }
  };

  getCustomerById = async (id: number) => {
    return await this.customerRepo.existingCustomer(undefined, undefined, id);
  };

  updateProfile = async (
    customerId: number,
    input: EditCustomerProfileInputs
  ) => {
    const customer = await this.customerRepo.existingCustomer(undefined, undefined, customerId);
    if (!customer || !customer.personId) return null;

    await this.personRepo.update(customer.personId, {
      fullName: input.firstName + " " + input.lastName,
    });

    return customer;
  };

  addToCart = async (customerId: number, foodId: number, unit: number) => {
    return await this.customerRepo.addToCart(customerId, foodId, unit);
  };

  getCart = async (customerId: number) => {
    return await this.customerRepo.getCart(customerId);
  };
}
