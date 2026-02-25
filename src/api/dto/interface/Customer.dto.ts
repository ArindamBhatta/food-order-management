export class CreateCustomerDTO {
    email!: string;
    password!: string;
    phone!: string;
    constructor(data: any) {
        Object.assign(this, data);
    }
}

export class CustomerLoginDTO {
    email?: string;
    phone?: string;
    password!: string;
}

export class EditCustomerProfileInputs {
    firstName!: string;
    lastName!: string;
    address!: string;
    constructor(data: any) {
        Object.assign(this, data);
    }
}

export interface CustomerPayload {
    _id: string;
    email: string;
    verified: boolean;
    role: 'customer';
}

export interface OrderInputs {
    foodDocId: string;
    unit: number;
}
