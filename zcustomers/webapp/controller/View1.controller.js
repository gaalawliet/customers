sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/core/Fragment",
  "sap/m/MessageToast",
  "sap/m/MessageBox",
  "sap/ui/Device"
], function (Controller, Fragment, MessageToast, MessageBox, Device) {
  "use strict";

  return Controller.extend("zcustomers.controller.View1", {
    onInit: function () {
    },

    onTableSelectionChange: function (oEvent) {

      debugger;
      let oSmartTable = this.getView().byId("st_customers").getTable();
      let aSelectedPaths = oSmartTable._aSelectedPaths;

      if (aSelectedPaths) {
        let oContext = oSmartTable.getModel().getContext(aSelectedPaths[0]);
        let oSelectedData = oContext.getObject();

        //this.getModel("layoutMod").setProperty("/state", sAppState);

        // Determina se devemos substituir o histórico
        //var bIsDetailView =
          //this.getView().getModel("layoutMod").getProperty("/layout") !== "OneColumn";

        this.getOwnerComponent()
          .getRouter()
          .navTo(
            "RouteView2",
            { TransportRequest: oSelectedData.TransportRequest }
         //   bIsDetailView
          ); // true = substituí histórico, falso = nova entrada histórico*/
      }
    },

    onCreateCustomer: function () {
      var oView = this.getView();
      if (!this.byId("openDialog")) {
        Fragment.load({
          id: oView.getId(),
          name: "zcustomers.view.Create",
          controller: this,
        }).then(function (oDialog) {
          oView.addDependent(oDialog);
          oDialog.open();
        });
      } else {
        this.byId("openDialog").open();
      }
    },

    handleSaveBtnPress: function () {
      var oView = this.getView();
      var clientName = oView.byId("nameClient").getValue().trim();

      if (!clientName) {
        MessageToast.show("Nome do cliente não preenchido!");
        return;
      }

      var payload = {
        Action: "REGISTERCUSTOMER",
        Payload: JSON.stringify([{ Name: clientName }])
      };

      var oModel = oView.getModel();
      sap.ui.core.BusyIndicator.show(0);

      oModel.create("/JsonCommSet", payload, {
        success: function () {
          MessageToast.show("Cliente registrado com sucesso");
          oModel.refresh();
          oView.byId("nameClient").setValue("");
          this.handleCancelBtnPress();
        }.bind(this),
        error: function (oError) {
          MessageToast.show(JSON.parse(oError.responseText).error.message.value);
        },
        complete: function () {
          sap.ui.core.BusyIndicator.hide();
        }
      });
    },

    handleCancelBtnPress: function () {
      var oView = this.getView();
      this.byId("openDialog").destroy();
      oView.getModel().refresh();
      ["nameClient", "addressClient", "phoneClient"].forEach(id => oView.byId(id)?.setValue(""));
    },

    handleSaveBtnPressEdit: function () {
      var oSmartTable = this.getView().byId("st_customers").getTable();
      if (oSmartTable._aSelectedPaths.length !== 1) {
        MessageBox.error("Selecione exatamente uma linha.");
        return;
      }

      var SelectedItem = oSmartTable.getModel().getProperty(oSmartTable._aSelectedPaths[0]);
      var oView = this.getView();

      var address = oView.byId("addressClientEdit").getValue().trim();
      var name = oView.byId("nameClientEdit").getValue().trim();
      var phone = oView.byId("phoneClientEdit").getValue().replace(/[()\s]/g, "");

      if (!name || !address || !phone) {
        MessageToast.show("Todos os campos devem ser preenchidos!");
        return;
      }

      var payload = {
        Action: "UPDATECUSTOMER",
        Payload: JSON.stringify([{ Name: name, Address: address, Phone: phone, CUSTOMER_COD: SelectedItem.CodigoCliente }])
      };

      var oModel = oView.getModel();
      sap.ui.core.BusyIndicator.show(0);

      oModel.create("/JsonCommSet", payload, {
        success: function () {
          MessageToast.show("Cliente editado com sucesso");
          oModel.refresh();
          this.handleCancelBtnPressEdit();
        }.bind(this),
        error: function (oError) {
          MessageToast.show(JSON.parse(oError.responseText).error.message.value);
        },
        complete: function () {
          sap.ui.core.BusyIndicator.hide();
        }
      });
    },

    onUpdateCustomer: function () {
      var oSmartTable = this.getView().byId("st_customers").getTable();
      if (oSmartTable._aSelectedPaths.length !== 1) {
        MessageBox.error("Selecione exatamente uma linha.");
        return;
      }

      var SelectedItem = oSmartTable.getModel().getProperty(oSmartTable._aSelectedPaths[0]);
      var oView = this.getView();
      oView.getModel("EditFragmentModel").setData(SelectedItem);

      if (!this.byId("editDialog")) {
        Fragment.load({
          id: oView.getId(),
          name: "zcustomers.view.CreateEdit",
          controller: this,
        }).then(function (oDialog) {
          oView.addDependent(oDialog);
          oDialog.open();
        });
      } else {
        this.byId("editDialog").open();
      }
    },

    handleCancelBtnPressEdit: function () {
      this.byId("editDialog").destroy();
      this.getView().getModel().refresh();
    },

    onDeleteCustomer: function () {
      debugger;
      var oView = this.getView();
      var oSmartTable = oView.byId("st_customers").getTable();
      var CustomerData = oSmartTable._aSelectedPaths.map(path => ({
        TRANSPORT_REQUEST: oSmartTable.getModel().getProperty(path).TransportRequest
      }));

      if (!CustomerData.length) {
        MessageBox.error("Nenhuma linha selecionada.");
        return;
      }

      MessageBox.confirm("Deseja realmente excluir os dados da solicitação de transporte?", {
        title: "Atenção",
        icon: MessageBox.Icon.WARNING,
        onClose: function (oAction) {
          if (oAction === MessageBox.Action.OK) {
            var payload = { Action: "DELETEREQUEST", Payload: JSON.stringify(CustomerData) };
            sap.ui.core.BusyIndicator.hide();

            oView.getModel().create("/JsonCommSet", payload, {
              success: function () {
                MessageToast.show("Solicitação excluida com sucesso!");
                oSmartTable.rebindTable();
              },
              error: function (oError) {
                MessageToast.show(JSON.parse(oError.responseText).error.message.value);
              },
              complete: function () {
                sap.ui.core.BusyIndicator.hide();
              }
            });
          }
        }
      });
    },

    onSmartFilterBarFilterChange: function(oEvent) {
      oEvent.getSource().search();

    },

    onValueHelpRequest: function () {

      debugger;
 
      var oModel = this.getView().getModel();
       
      oModel.read("/ZRDWGP_CUSTOMERS_NUMBER", {
                success: function (oData, oResponse) {

                  debugger;
       
                  if (oData.results.length === 0) {
       
                  }
       
                }.bind(this),
                error: function (oError) {

                  debugger;
       
                }.bind(this),
              });
      }

  });
});
