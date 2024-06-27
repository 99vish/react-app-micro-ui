import React from 'react';
import './styles.css';
import AddSteps from './pages/AddSteps.js'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AddRef from './pages/AddRef.js';
import LandingPage from './LandingPage.js';
const fs = require('fs');

// import FileTree from './FileTree.js';

// import raw from './constants/singleSourceOR.ts';

// import './newStyles.css';

// const fileStructure = {
//     "C:": {
//       "Automation": {
//         "wtg-playwright-json-execution": {
//           "src": {
//             "inputs": {
//               "apiReferences": {
//                 "carrierGo": ["actuals.hbs"],
//                 "logistics": [
//                   "createBooking.hbs",
//                   "createShipment.json",
//                   "getBookingDetails.json"
//                 ]
//               },
//               "functions": {
//                 "API": [
//                   "carrierGo.ts",
//                   "contractManagement.ts",
//                   "index.ts",
//                   "logistics.ts",
//                   "visibility.ts"
//                 ],
//                 "UI": {
//                   "carrierGo": [
//                     "invoice2.0.ts",
//                     "workOrder.ts"
//                   ],
//                   "common": [
//                     "common.ts",
//                     "login.ts"
//                   ],
//                   "functions.ts": "functions.ts",
//                   "index.ts": "index.ts",
//                   "logistics": {
//                     "admin": ["carrierSelectionConfig.ts"],
//                     "bmaps": ["myLocations.ts"],
//                     "contractManagement": [
//                       "accessorials.ts",
//                       "fuelSurcharge.ts",
//                       "rateLookup.ts",
//                       "ratesAndRoutes.ts",
//                       "templates.ts",
//                       "zones.ts"
//                     ],
//                     "freightAuditAndPay": {
//                       "configuration": ["nextNumber.ts"],
//                       "finance": ["invoice.ts"]
//                     },
//                     "masterData": ["masterDataConfiguration.ts"],
//                     "shipmentsAndOrders": [
//                       "amendmentCenter.ts",
//                       "importData.ts",
//                       "orders.ts",
//                       "shipments.ts"
//                     ],
//                     "visibility": ["shipmentVisibility.ts"]
//                   }
//                 }
//               },
//               "payloads": {
//                 "api": {
//                   "carrierGo": [
//                     "acceptWO.hbs",
//                     "actuals.hbs",
//                     "apointment.hbs"
//                   ],
//                   "logistics": [
//                     "createBooking.hbs",
//                     "createShipment.hbs",
//                     "dynamicCreateShipment.hbs"
//                   ]
//                 },
//                 "kafka": {
//                   "visibility": [
//                     "visibilityEvent.hbs",
//                     "visibilityEvents.csv"
//                   ]
//                 },
//                 "staticShipment.json": "staticShipment.json",
//                 "testapi.json": "testapi.json"
//               },
//               "testFiles": {
//                 "debug": [
//                   "cgInvoiceFlow.json",
//                   "createShipment.json",
//                   "demo.json",
//                   "demo1.json",
//                   "oneBrowser.json",
//                   "oneBrowserWithEmptySession.json",
//                   "oneBrowserWithSession.json",
//                   "shipmentSerach.json",
//                   "twoBrowser.json"
//                 ],
//                 "debug2": [
//                   "conditionalTesting.json",
//                   "conditionalUI.json",
//                   "downstreamStopping.json",
//                   "envVariablesTesting.json",
//                   "envVariablesUI.json"
//                 ],
//                 "demo": [
//                   "apiTests.json",
//                   "cgFlow.json",
//                   "createBooking.json",
//                   "createShipment.json",
//                   "debug.json",
//                   "login.json",
//                   "tmsDRAY.json"
//                 ],
//                 "references": [
//                   "kafka.json",
//                   "kafkareference.json",
//                   "targetJSON.json"
//                 ]
//               },
//               "uiReferences": {
//                 "carrierGo": {
//                   "common": ["refresh.json"],
//                   "invoices2.0": [
//                     "createInvoice.json",
//                     "loadCreateInvoice.json"
//                   ],
//                   "workOrders": [
//                     "acceptWorkOrder.json",
//                     "addComment.json",
//                     "amendChargesByMC.json",
//                     "attachments.json",
//                     "createWorkOrder.json",
//                     "loadCreateWorkOrder.json",
//                     "loadManageWorkOrder.json",
//                     "openWorkOrder.json",
//                     "postActuals.json",
//                     "rejectWorkorder.json",
//                     "searchWorkOrderAndStatusCheck.json",
//                     "validateAutoInvoice.json"
//                   ]
//                 },
//                 "common": [
//                   "login.json",
//                   "loginCG.json",
//                   "logout.json"
//                 ],
//                 "logistics": {
//                   "bookings": ["loadBookings.json"],
//                   "closeAllLogisiticsTab.json": "closeAllLogisiticsTab.json",
//                   "freightAuditAndPay": {
//                     "finance": [
//                       "approveInvoice.json",
//                       "declineInvoive.json",
//                       "loadManageInvoices.json",
//                       "openInvoiceAndStatusCheck.json",
//                       "submitInvoice.json"
//                     ]
//                   },
//                   "rateLookUp": [
//                     "loadRateLookUp.json",
//                     "rateShopping.hbs"
//                   ],
//                   "ratesAndroutes": [
//                     "addRate.hbs",
//                     "addRoute.hbs",
//                     "loadRates&Routes.json"
//                   ],
//                   "shipmentsAndOrders": [
//                     "addCharges.json",
//                     "approveDeclineAmendments.json",
//                     "assignCarrier.json",
//                     "cancelShipment.json",
//                     "createShipment.hbs",
//                     "dynamicTableSearch.json",
//                     "loadAmendmentCenter.json",
//                     "loadChangeCarrier.json",
//                     "loadCreateShipment.json",
//                     "loadOrders.json",
//                     "loadSelectCarrier.json",
//                     "loadShipments.json",
//                     "openShipmentAndStatusCheck.json"
//                   ]
//                 }
//               },
//               "uploadFiles": [
//                 "AddMultipleRailDetails.xlsx",
//                 "CarrierGo.pdf",
//                 "FSCShipperTemplate.xlsx",
//                 "Rate-DRAY-CustomAttribute.xlsx",
//                 "Rate-DRAY-Shipper-Template.xlsx",
//                 "Rate-LTL-Shipper-Template.xlsx",
//                 "RoutingGuideBasis.xlsx",
//                 "Shipments.pdf"
//               ]
//             }
//           }
//         }
//       }
//     }
//   };

const App = () => {
  // const reader = new FileReader()


  // const readFile = (path, callback) => {
  //   fs.readFile(path, (err, data) => {
  //   if (err) {
  //   console.error(err);
  //   } else {
  //   console.log(data);
  //   }
  //   });
  //   };
    
  //   readFile('./constants/singleSourceOR.ts', (data) => {
  //   console.log(data);
  //   });
  return (

    //   <div>
    // <h1>File Structure</h1>
    // <FileTree data={fileStructure} />
    // </div>

    <Router>
      <div>
        <Routes>
          <Route path="/add-steps" element={<AddSteps />} />
          <Route path="/add-ref" element={<AddRef />} />
          <Route path="/" element={<LandingPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
