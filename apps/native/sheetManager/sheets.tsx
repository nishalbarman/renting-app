import { SheetDefinition, registerSheet } from "react-native-actions-sheet";
import FeedbackSheet from "./Sheets/AddFeedback";
import AddressListSheet from "./Sheets/AddressList";
import AddAddress from "./Sheets/AddAddress";
import LocationMap from "./Sheets/LocationMap";

registerSheet("add-feedback-sheet", FeedbackSheet);
registerSheet("address-list-sheet", AddressListSheet);
registerSheet("add-address-sheet", AddAddress);
registerSheet("location-select-map", LocationMap);

// We extend some of the types here to give us great intellisense
// across the app for all registered sheets.
declare module "react-native-actions-sheet" {
  interface Sheets {
    "add-feedback-sheet": SheetDefinition<{
      payload: {
        productId: Number;
      };
    }>;
    "address-list-sheet": SheetDefinition;
    "add-address-sheet": SheetDefinition;
    "location-select-map": SheetDefinition;
  }
}

// action sheet manager code to access the action sheets from anywhere in this application

export {};
