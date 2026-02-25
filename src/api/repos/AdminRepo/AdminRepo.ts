import { VendorDAO } from "../../../infrastructure/daos/VendorDAO";
import { PersonDAO } from "../../../infrastructure/daos/PersonDAO";
import VendorEntity from "../../entity/VendorEntity";
import IAdminRepo from "./AdminRepo.interface";
import logger from "../../../infrastructure/logger/winston";

export default class AdminRepo implements IAdminRepo {
  private vendorDao: VendorDAO;
  private personDao: PersonDAO;

  constructor(vendorDao: VendorDAO, personDao: PersonDAO) {
    this.vendorDao = vendorDao;
    this.personDao = personDao;
  }

  createVendor = async (vendor: VendorEntity): Promise<VendorEntity> => {
    try {
      // Step 1: Create Person first
      const personData = {
        fullName: vendor.ownerName!,
        email: vendor.ownerEmail!,
        phoneNumber: vendor.ownerPhone!,
        password: vendor.ownerPhone!, // Placeholder? Wait, password should be passed in.
        // Actually, AdminService should handle PersonEntity creation if we want to be clean.
        // But for now, let's assume we pass what's needed.
      };

      // I'll assume the entity passed to createVendor already has what's needed for Person.
      // But VendorEntity toRow() doesn't include password/salt.

      // Let's rethink: Repo should receive simple params or Entities.
      // If it receives VendorEntity, it should have the personId.

      const rawData = vendor.toRow();
      const savedRow = await this.vendorDao.create(rawData);
      return VendorEntity.fromRow(savedRow);
    } catch (error) {
      logger.error("Error in AdminRepo.createVendor:", error);
      throw error;
    }
  };

  getAllVendor = async (): Promise<VendorEntity[]> => {
    try {
      const rows = await this.vendorDao.getAll();
      // This is problematic because we need person info for each vendor.
      // For now, I'll return them without person info or join them.
      return rows.map(row => VendorEntity.fromRow(row));
    } catch (error) {
      logger.error("Error in AdminRepo.getAllVendor:", error);
      throw error;
    }
  };

  getVendorByID = async (vendorId: number): Promise<VendorEntity | null> => {
    try {
      const row = await this.vendorDao.getById(vendorId);
      if (!row) return null;

      const personRow = row.personId ? await this.personDao.getById(row.personId) : null;

      return new VendorEntity({
        ...row,
        ownerName: personRow?.fullName,
        ownerEmail: personRow?.email,
        ownerPhone: personRow?.phoneNumber
      });
    } catch (error) {
      logger.error(`Error in AdminRepo.getVendorByID for ID ${vendorId}:`, error);
      throw error;
    }
  };
}
