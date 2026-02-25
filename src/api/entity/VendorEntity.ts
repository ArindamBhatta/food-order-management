export default class VendorEntity {
  private _vendorId?: number;
  private _vendorName: string;
  private _ownerName: string;
  private _ownerEmail: string;
  private _ownerPhone: string;
  private _vendorDescription?: string | null;
  private _cuisineType?: string | null;
  private _openingTime?: string | null;
  private _closingTime?: string | null;
  private _avgPreparationTime?: number | null;
  private _vendorLogoUrl?: string | null;
  private _isActive: boolean;
  private _gstNumber?: string | null;
  private _fssaiLicense?: string | null;
  private _ratingAverage: number;
  private _totalReviews: number;
  private _password?: string | null;
  private _salt?: string | null;
  private _accessToken?: string | null;
  private _refreshToken?: string | null;
  private _createdAt: Date;

  constructor(data: {
    vendorId?: number;
    vendorName: string;
    ownerName: string;
    ownerEmail: string;
    ownerPhone: string;
    vendorDescription?: string | null;
    cuisineType?: string | null;
    openingTime?: string | null;
    closingTime?: string | null;
    avgPreparationTime?: number | null;
    vendorLogoUrl?: string | null;
    isActive?: boolean;
    gstNumber?: string | null;
    fssaiLicense?: string | null;
    ratingAverage?: number;
    totalReviews?: number;
    password?: string | null;
    salt?: string | null;
    accessToken?: string | null;
    refreshToken?: string | null;
    createdAt?: Date;
  }) {
    this._vendorId = data.vendorId;
    this._vendorName = data.vendorName;
    this._ownerName = data.ownerName;
    this._ownerEmail = data.ownerEmail;
    this._ownerPhone = data.ownerPhone;
    this._vendorDescription = data.vendorDescription;
    this._cuisineType = data.cuisineType;
    this._openingTime = data.openingTime;
    this._closingTime = data.closingTime;
    this._avgPreparationTime = data.avgPreparationTime;
    this._vendorLogoUrl = data.vendorLogoUrl;
    this._isActive = data.isActive ?? true;
    this._gstNumber = data.gstNumber;
    this._fssaiLicense = data.fssaiLicense;
    this._ratingAverage = data.ratingAverage ?? 0;
    this._totalReviews = data.totalReviews ?? 0;
    this._password = data.password;
    this._salt = data.salt;
    this._accessToken = data.accessToken;
    this._refreshToken = data.refreshToken;
    this._createdAt = data.createdAt || new Date();
  }

  get vendorId() { return this._vendorId; }
  get vendorName() { return this._vendorName; }
  get ownerName() { return this._ownerName; }
  get ownerEmail() { return this._ownerEmail; }
  get ownerPhone() { return this._ownerPhone; }
  get vendorDescription() { return this._vendorDescription; }
  get cuisineType() { return this._cuisineType; }
  get openingTime() { return this._openingTime; }
  get closingTime() { return this._closingTime; }
  get avgPreparationTime() { return this._avgPreparationTime; }
  get vendorLogoUrl() { return this._vendorLogoUrl; }
  get isActive() { return this._isActive; }
  get gstNumber() { return this._gstNumber; }
  get fssaiLicense() { return this._fssaiLicense; }
  get ratingAverage() { return this._ratingAverage; }
  get totalReviews() { return this._totalReviews; }
  get password() { return this._password; }
  get salt() { return this._salt; }
  get accessToken() { return this._accessToken; }
  get refreshToken() { return this._refreshToken; }
  get createdAt() { return this._createdAt; }

  static fromRow(row: any): VendorEntity {
    return new VendorEntity({
      vendorId: row.vendorId,
      vendorName: row.vendorName,
      ownerName: row.ownerName,
      ownerEmail: row.ownerEmail,
      ownerPhone: row.ownerPhone,
      vendorDescription: row.vendorDescription,
      cuisineType: row.cuisineType,
      openingTime: row.openingTime,
      closingTime: row.closingTime,
      avgPreparationTime: row.avgPreparationTime,
      vendorLogoUrl: row.vendorLogoUrl,
      isActive: row.isActive,
      gstNumber: row.gstNumber,
      fssaiLicense: row.fssaiLicense,
      ratingAverage: row.ratingAverage,
      totalReviews: row.totalReviews,
      password: row.password,
      salt: row.salt,
      accessToken: row.accessToken,
      refreshToken: row.refreshToken,
      createdAt: row.createdAt,
    });
  }

  toRow() {
    return {
      vendorName: this._vendorName,
      ownerName: this._ownerName,
      ownerEmail: this._ownerEmail,
      ownerPhone: this._ownerPhone,
      vendorDescription: this._vendorDescription,
      cuisineType: this._cuisineType,
      openingTime: this._openingTime,
      closingTime: this._closingTime,
      avgPreparationTime: this._avgPreparationTime,
      vendorLogoUrl: this._vendorLogoUrl,
      isActive: this._isActive,
      gstNumber: this._gstNumber,
      fssaiLicense: this._fssaiLicense,
      ratingAverage: this._ratingAverage,
      totalReviews: this._totalReviews,
      password: this._password,
      salt: this._salt,
      accessToken: this._accessToken,
      refreshToken: this._refreshToken,
    };
  }
}
