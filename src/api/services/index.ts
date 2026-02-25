import AdminService from "./AdminService/AdminService";
import VendorService from "./VendorService/VendorService";
import { vendorRepo, foodRepo, adminRepo, customerRepo, personRepo } from "../repos";
import FoodService from "./FoodService/FoodService";
import CustomerService from "./CustomerService/CustomerService";

const adminService = new AdminService(adminRepo, personRepo);
const vendorService = new VendorService(vendorRepo);
const customerService = new CustomerService(customerRepo, personRepo, foodRepo);
const foodService = new FoodService(vendorRepo, foodRepo);

export { adminService, vendorService, foodService, customerService };
