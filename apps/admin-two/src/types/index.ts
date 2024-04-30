export type Address = {
  user?: string;
  city: string;
  country: string;
  locality: string;
  postalCode: string;
  prefix: string;
  state: string;
  streetName: string;

  longitude?: number;
  latitude?: number;

  createdAt?: string;
  updatedAt?: string;
};

export type User = {
  email: string;
  mobileNo: string;
  name: string;
  _id: string;
};

export type OrderAddress = {
  address: Address;
  location: [number, number];
};

export type Order = {
  address: OrderAddress;
  center: string | null;
  color: string | null;
  createdAt: string;
  orderGroupID: string;
  orderStatus: string;
  orderType: string;
  paymentMode: string;
  paymentStatus: string;
  paymentTxnId: string;
  pickupDate: string | null;
  previewImage: string;
  price: number;
  product: string;
  quantity: number;
  rentPickedUpDate: string | null;
  rentReturnDueDate: string | null;
  shipmentType: string;
  shippingPrice: number;
  rentDays?: number;
  size: string | null;
  title: string;
  trackingLink: string;
  updatedAt: string;
  user: string;
  __v?: number | string | undefined | null;
  _id: string;
};

export type OrderGroup = {
  address: OrderAddress;
  createdAt: string;
  orderGroupID: string;
  orderType: string;
  orders: Order[];
  paymentTransactionId: string;
  totalDocumentCount: number;
  totalPrice: number;
  user: User;
};

export type PaymentSummary = {
  paymentStatus: string;
  shippingPrice: number;
  subTotalPrice: number;
  totalPrice: number;
};

export type Base64StringWithType = {
  base64String: string;
  type: String;
};

export type ProductVariant = {
  product: string;

  previewImage:
    | string
    | string[]
    | File[]
    | FileList
    | Base64StringWithType[]
    | null;
  slideImages: string[] | File[] | FileList | Base64StringWithType[] | null;

  size: string;
  color: string;

  availableStocks: number;

  shippingPrice: number;
  rentingPrice: number;
  discountedPrice: number;
  originalPrice: number;
};

export type Category = {
  _id: string;
  categoryName: string;
  categoryImageUrl: string;
  createdAt: string;
  updatedAt: string;
  __v?: number | undefined;
  categoryKey: string;
};

export type Product = {
  previewImage:
    | string
    | string[]
    | File[]
    | FileList
    | Base64StringWithType[]
    | null;
  title: string;
  category: string | Category;
  slideImages: string[] | File[] | FileList | Base64StringWithType[] | null;
  description: string;

  stars?: string | number;
  totalFeedbacks?: string | number;

  //   productType: ["rent", "buy", "both"];
  productType?: string;

  shippingPrice: string | number;
  availableStocks: string | number;
  rentingPrice: string | number;
  discountedPrice: string | number;
  originalPrice: string | number;

  isVariantAvailable: boolean;
  productVariant?: ProductVariant[] | { [key: string]: ProductVariant };
  createdAt?: string;
  updatedAt?: string;
  _id?: string;
};

export type Center = {
  name: string;
  email: string;
  password: string;
  mobileNo: string;
  centerName: string;
  prefix?: string;
  streetName: string;
  locality: string;
  postalCode: string;
  city: string;
  state: string;
  country: string;
  longitude: number | string;
  latitude: number | string;
  addressProofImage:
    | string
    | string[]
    | File[]
    | FileList
    | Base64StringWithType[]
    | null;
  idProofImage:
    | string
    | string[]
    | File[]
    | FileList
    | Base64StringWithType[]
    | null;
  centerImage: string[] | File[] | FileList | Base64StringWithType[] | null;
  address?: Address;
  _id?: string;
};
