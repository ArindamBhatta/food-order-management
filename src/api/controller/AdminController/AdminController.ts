import AdminService from "../../services/AdminService/AdminService";
import IAdminController from "./AdminController.interface";
import {
  CreateVendorDTO,
  VendorResponseDTO,
} from "../../dto/interface/Vendor.dto";
import { ControllerPayload } from "../../../constants";
import logger from "../../../infrastructure/logger/winston";

export default class AdminController implements IAdminController {
  private adminService: AdminService;

  constructor(adminService: AdminService) {
    this.adminService = adminService;
  }

  createVendor = async (
    payload: ControllerPayload
  ): Promise<VendorResponseDTO> => {
    try {
      const createVendorDTO = new CreateVendorDTO(payload.req.body);
      const vendor = await this.adminService.createVendor(createVendorDTO);
      return new VendorResponseDTO(vendor);
    } catch (error) {
      logger.error("Error in AdminController.createVendor:", error);
      throw new Error("Failed to create vendor");
    }
  };

  getAllVendor = async (
    payload: ControllerPayload
  ): Promise<VendorResponseDTO[]> => {
    try {
      const vendors = await this.adminService.getAllVendor();
      return vendors.map((vendor) => new VendorResponseDTO(vendor));
    } catch (error) {
      logger.error("Error in AdminController.getAllVendor:", error);
      throw new Error("Failed to get vendors");
    }
  };

  getVendorById = async (
    payload: ControllerPayload
  ): Promise<VendorResponseDTO> => {
    const vendorId = parseInt(payload.req.params.id);
    try {
      const vendor = await this.adminService.getVendorByID(vendorId);
      if (!vendor) throw new Error("Vendor not found");
      return new VendorResponseDTO(vendor);
    } catch (error) {
      logger.error("Error in AdminController.getVendorByID:", error);
      throw new Error("Failed to get vendor by ID");
    }
  };
}
