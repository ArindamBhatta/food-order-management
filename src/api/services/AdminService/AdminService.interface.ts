import VendorEntity from "../../entity/VendorEntity";
import { CreateVendorDTO } from "../../dto/interface/Vendor.dto";

export default interface IAdminService {
  createVendor(vendorDto: CreateVendorDTO): Promise<VendorEntity>;
  getVendorByID(vendorId: number): Promise<VendorEntity | null>;
  getAllVendor(): Promise<VendorEntity[]>;
}
