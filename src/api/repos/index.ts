import { VendorDAO } from "../../infrastructure/daos/VendorDAO";
import { FoodDAO } from "../../infrastructure/daos/FoodDAO";
import { CustomerDAO } from "../../infrastructure/daos/CustomerDAO";
import { PersonDAO } from "../../infrastructure/daos/PersonDAO";
import { CartDAO } from "../../infrastructure/daos/CartDAO";
import { CartItemDAO } from "../../infrastructure/daos/CartItemDAO";

// Initialize repositories
import AdminRepo from "./AdminRepo/AdminRepo";
import VendorRepo from "./VendorRepo/VendorRepo";
import FoodRepo from "./FoodRepo/FoodRepo";
import CustomerRepo from "./CustomerRepo/CustomerRepo";
import PersonRepo from "./PersonRepo/PersonRepo";

// Create DAO instances
const vendorDAO = new VendorDAO();
const foodDAO = new FoodDAO();
const customerDAO = new CustomerDAO();
const personDAO = new PersonDAO();
const cartDAO = new CartDAO();
const cartItemDAO = new CartItemDAO();

// Create repository instances
const adminRepo = new AdminRepo(vendorDAO, personDAO);
const vendorRepo = new VendorRepo(vendorDAO, personDAO);
const customerRepo = new CustomerRepo(customerDAO, personDAO, cartDAO, cartItemDAO);
const foodRepo = new FoodRepo(foodDAO, vendorDAO);
const personRepo = new PersonRepo(personDAO);

// Export repositories
export { adminRepo, vendorRepo, foodRepo, customerRepo, personRepo };
