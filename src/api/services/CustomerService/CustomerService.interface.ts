import CustomerEntity from "../../entity/CustomerEntity";
import { CreateCustomerDTO } from "../../dto/interface/Customer.dto";

export default interface ICustomerService {
  signUp(
    input: CreateCustomerDTO
  ): Promise<{ customer: CustomerEntity; otp: number }>;
  verifyOtp(
    otp: number,
    email?: string,
    phone?: string,
    customerId?: number
  ): Promise<{ customer: CustomerEntity | null; signature?: string }>;
  signIn(password: string, email?: string, phone?: string): Promise<{ customer: CustomerEntity; signature: string } | null>;
}
