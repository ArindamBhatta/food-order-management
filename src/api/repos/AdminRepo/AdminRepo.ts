import { VendorDAO } from "../../../infrastructure/daos/VendorDAO";
import VendorEntity from "../../entity/VendorEntity";
import IAdminRepo from "./AdminRepo.interface";
import logger from "../../../infrastructure/logger/winston";

export default class AdminRepo implements IAdminRepo {
  private vendorDao: VendorDAO;

  constructor(vendorDao: VendorDAO) {
    this.vendorDao = vendorDao;
  }

  createVendor = async (vendor: VendorEntity): Promise<VendorEntity> => {
    try {
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
      return rows.map(row => VendorEntity.fromRow(row));
    } catch (error) {
      logger.error("Error in AdminRepo.getAllVendor:", error);
      throw error;
    }
  };

  getVendorByID = async (vendorId: number): Promise<VendorEntity | null> => {
    try {
      const row = await this.vendorDao.getById(vendorId);
      return row ? VendorEntity.fromRow(row) : null;
    } catch (error) {
      logger.error(`Error in AdminRepo.getVendorByID for ID ${vendorId}:`, error);
      throw error;
    }
  };
}
