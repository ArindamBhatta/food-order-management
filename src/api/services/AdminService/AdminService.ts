import VendorEntity from "../../entity/VendorEntity";
import PersonEntity from "../../entity/PersonEntity";
import IAdminService from "./AdminService.interface";
import { generateSalt, hashPassword } from "../../utils/auth.utility";
import logger from "../../../infrastructure/logger/winston";
import { CreateVendorDTO } from "../../dto/interface/Vendor.dto";
import IAdminRepo from "../../repos/AdminRepo/AdminRepo.interface";
import IPersonRepo from "../../repos/PersonRepo/PersonRepo.interface";


export default class AdminService implements IAdminService {
  private adminRepo: IAdminRepo;
  private personRepo: IPersonRepo;

  constructor(adminRepo: IAdminRepo, personRepo: IPersonRepo) {
    this.adminRepo = adminRepo;
    this.personRepo = personRepo;
  }

  createVendor = async (vendorDto: CreateVendorDTO): Promise<VendorEntity> => {
    try {
      // Step 1: Create Person first
      const salt = await generateSalt();
      const hashedPassword = await hashPassword(vendorDto.password, salt);

      const person = new PersonEntity({
        fullName: vendorDto.ownerName,
        email: vendorDto.email,
        phoneNumber: vendorDto.phone,
        password: hashedPassword,
        salt: salt,
        verified: true,
      });

      const savedPerson: PersonEntity = await this.personRepo.create(person);

      // Step 2: Create Vendor linked to Person
      const vendor = new VendorEntity({
        personId: savedPerson.personId,
        vendorName: vendorDto.name,
        isActive: true,
      });

      const savedVendor: VendorEntity = await this.adminRepo.createVendor(vendor);

      return new VendorEntity({
        ...savedVendor.toRow(),
        vendorId: savedVendor.vendorId,
        ownerName: savedPerson.fullName,
        ownerEmail: savedPerson.email,
        ownerPhone: savedPerson.phoneNumber,
        verified: savedPerson.verified
      });
    } catch (error) {
      console.error("Error in AdminService.createVendor:", error);
      throw error;
    }
  };

  getAllVendor = async (): Promise<VendorEntity[]> => {
    try {
      return await this.adminRepo.getAllVendor();
    } catch (error) {
      logger.error("Error in AdminService.getAllVendor:", error);
      throw error;
    }
  };

  getVendorByID = async (vendorId: number): Promise<VendorEntity | null> => {
    try {
      return await this.adminRepo.getVendorByID(vendorId);
    } catch (error) {
      logger.error(`Error in AdminService.getVendorByID for ID ${vendorId}:`, error);
      throw error;
    }
  };
}
