import { SheetDefinition, registerSheet } from "react-native-actions-sheet";
import FeedbackSheet from "./Sheets/AddFeedback";
import AddressListSheet from "./Sheets/AddressList";
// import AddAddress from "./Sheets/AddAddress";
import LocationMap from "./Sheets/LocationMap";
import OrderTrack from "./Sheets/OrderTrack";
import UserDetailsUpdate from "./Sheets/UserDetailsUpdate";
import ProductSort from "./Sheets/ProductSort";

registerSheet("add-feedback-sheet", FeedbackSheet);
registerSheet("address-list-sheet", AddressListSheet);
// registerSheet("add-address-sheet", AddAddress);
registerSheet("location-select-map", LocationMap);
registerSheet("track-order", OrderTrack);
registerSheet("update-profile", UserDetailsUpdate);
registerSheet("product-sort-sheet", ProductSort);

// We extend some of the types here to give us great intellisense
// across the app for all registered sheets.
declare module "react-native-actions-sheet" {
  interface Sheets {
    "add-feedback-sheet": SheetDefinition<{
      payload: {
        productId: String;
      };
    }>;
    "address-list-sheet": SheetDefinition;
    // "add-address-sheet": SheetDefinition;
    "location-select-map": SheetDefinition;
    "track-order": SheetDefinition<{
      payload: {
        orderId: String;
      };
    }>;
    "update-profile": SheetDefinition;
    "product-sort-sheet": SheetDefinition;
  }
}

// action sheet manager code to access the action sheets from anywhere in this application

export {};
