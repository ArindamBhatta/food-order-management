import AdminRepo from "../../repos/AdminRepo/AdminRepo";
import VendorEntity from "../../entity/VendorEntity";
import IAdminService from "./AdminService.interface";
import { generateSalt, hashPassword } from "../../utils/auth.utility";
import logger from "../../../infrastructure/logger/winston";
import { CreateVendorDTO } from "../../dto/interface/Vendor.dto";

export default class AdminService implements IAdminService {
  private adminRepo: AdminRepo;

  constructor(adminRepo: AdminRepo) {
    this.adminRepo = adminRepo;
  }

  createVendor = async (vendorDto: CreateVendorDTO): Promise<VendorEntity> => {
    try {
      const salt = await generateSalt();
      const hashedPassword = await hashPassword(vendorDto.password, salt);

      const vendor = new VendorEntity({
        vendorName: vendorDto.name,
        ownerName: vendorDto.ownerName,
        ownerEmail: vendorDto.email,
        ownerPhone: vendorDto.phone,
        password: hashedPassword,
        salt: salt,
        // address and other fields could be processed here
      });

      const savedVendor = await this.adminRepo.createVendor(vendor);
      return savedVendor;
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
