sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/core/Fragment",
  "sap/m/MessageToast",
  "sap/m/MessageBox",
  "sap/ui/Device",
],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (Controller, Fragment, MessageToast, MessageBox, Device) {
    "use strict";

    return Controller.extend("zcustomers.controller.View1", {
      onInit: function () {

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
      handleSaveBtnPress: function (oEvent) {
        sap.ui.core.BusyIndicator.show(0);
        var oView = this.getView();

        var phone = oView.byId("phoneClient").getValue();
        var phoneSpace = phone.replace(/[()]/g, "");
        var phoneNumbers = phoneSpace.replace(/\s/g, "");
        debugger;
        if (phoneNumbers === "") {
          MessageToast.show("Telefone não preenchido!");
          sap.ui.core.BusyIndicator.hide();
        } else {
          var clientFragmentData = [
            {
              Name: oView.byId("nameClient").getValue(),
              Address: oView.byId("addressClient").getValue(),
              Phone: phoneNumbers,
            },
          ];

          var payload = {
            Action: "REGISTERCUSTOMER",
            Payload: JSON.stringify(clientFragmentData),
          };

          var oModel = oView.getModel();


          oModel.create("/JsonCommSet", payload, {
            success: function (oData, oResponse) {
              MessageToast.show("Cliente adicionado com sucesso");
              oModel.refresh(),
                oView.byId("nameClient").setValue(""),
                oView.byId("addressClient").setValue(""),
                oView.byId("phoneClient").setValue(""),

                this.handleCancelBtnPress();
              sap.ui.core.BusyIndicator.hide();
            }.bind(this),

            error: function (oError) {
              var oSapMessage = JSON.parse(oError.responseText);
              var msg = oSapMessage.error.message.value;
              MessageToast.show(msg);
              oModel.refresh();
              sap.ui.core.BusyIndicator.hide();
            },
          });
        }
      },

      handleCancelBtnPress: function () {
        this.byId("openDialog").destroy();
        var oView = this.getView();
        var oModel = oView.getModel();
        oModel.refresh(),
          oView.byId("nameClient").setValue(""),
          oView.byId("addressClient").setValue(""),
          oView.byId("phoneClient").setValue("")

      },

      handleSaveBtnPressEdit(oEvent) {
        sap.ui.core.BusyIndicator.show(0);
        var oSmartTable = this.getView().byId("st_customers").getTable();

        if (oSmartTable._aSelectedPaths.length > 1) { MessageBox.error("Selecione apenas uma linha."); }

        else if (oSmartTable._aSelectedPaths.length < 1) { MessageBox.error("Nenhuma linha selecionada."); }

        else {
          var SelectedItem = oSmartTable.getModel().getProperty(oSmartTable._aSelectedPaths.toString());
          var oView = this.getView();

          var address = oView.byId("addressClientEdit").getValue();
          var name = oView.byId("nameClientEdit").getValue();
          var phone = oView.byId("phoneClientEdit").getValue();
          var custumerCod = SelectedItem.CodigoCliente;
          var phoneSpace = phone.replace(/[()]/g, "");
          var phoneNumbers = phoneSpace.replace(/\s/g, "");

          switch ("") {
            case (phoneNumbers):
              MessageToast.show("Telefone não preenchido!");
              sap.ui.core.BusyIndicator.hide();

              break

            case (name):
              MessageToast.show("Nome não preenchido!");
              sap.ui.core.BusyIndicator.hide();

              break

            case (address):
              MessageToast.show("Endereço não preenchido!");
              sap.ui.core.BusyIndicator.hide();

              break

            default:
              var clientFragmentEditData = [
                {
                  Name: name,
                  Address: address,
                  Phone: phoneNumbers,
                  CUSTOMER_COD: custumerCod
                },
              ];

              var payload = {
                Action: "UPDATECUSTOMER",
                Payload: JSON.stringify(clientFragmentEditData),
              };

              var oModel = oView.getModel();


              oModel.create("/JsonCommSet", payload, {
                success: function (oData, oResponse) {
                  MessageToast.show("Cliente editado com sucesso");
                  oModel.refresh(),
                    oView.byId("nameClientEdit").setValue(""),
                    oView.byId("addressClientEdit").setValue(""),
                    oView.byId("phoneClientEdit").setValue(""),

                    this.handleCancelBtnPressEdit();
                  sap.ui.core.BusyIndicator.hide();
                }.bind(this),

                error: function (oError) {
                  var oSapMessage = JSON.parse(oError.responseText);
                  var msg = oSapMessage.error.message.value;
                  MessageToast.show(msg);
                  oModel.refresh();
                  sap.ui.core.BusyIndicator.hide();
                },
              });
              break
          }
        }

      },

      onUpdateCustomer: function () {
        var oSmartTable = this.getView().byId("st_customers").getTable();

        if (oSmartTable._aSelectedPaths.length > 1) { MessageBox.error("Selecione apenas uma linha."); }

        else if (oSmartTable._aSelectedPaths.length < 1) { MessageBox.error("Nenhuma linha selecionada."); }

        else {
          var SelectedItem = oSmartTable.getModel().getProperty(oSmartTable._aSelectedPaths.toString());
          var oView = this.getView();
          var modelCustomer = oView.getModel("EditFragmentModel");
          modelCustomer.setData(SelectedItem)

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

        }

      },

      handleCancelBtnPressEdit: function () {
        this.byId("editDialog").destroy();
        var oView = this.getView();
        var oModel = oView.getModel();
        oModel.refresh()
        // oView.byId("nameClientEdit").setValue(""),
        // oView.byId("addressClientEdit").setValue(""),
        // oView.byId("phoneClientEdit").setValue("")

      },



      onDeleteCustomer: function () {
        var CustomerData = [];
        var oView = this.getView();
        var oSmartTableTable = oView.byId("st_customers").getTable();
        var oSmartTable = oView.byId("st_customers");

        MessageBox.confirm("Deseja realmente excluir os dados do cliente?", {
          title: "Atenção",
          icon: sap.m.MessageBox.Icon.WARNING,
          onClose: function (oAction) {
            if (oAction === MessageBox.Action.OK) {
              oSmartTableTable._aSelectedPaths.forEach((aSelectedPath, i) => {
                var SelectedItem = oSmartTableTable
                  .getModel()
                  .getProperty(aSelectedPath.toString());
                CustomerData.push({
                  CUSTOMER_COD: SelectedItem.CodigoCliente
                });
              });

              var Payload = {
                Action: "DELETECUSTOMER",
                Payload: JSON.stringify(CustomerData)
              }

              var oModel = oView.getModel();

              oModel.create("/JsonCommSet", Payload, {
                success: function (oData, oResponse) {
                  MessageToast.show("Cliente excluído com sucesso!");
                  oSmartTable.rebindTable()

                }.bind(this),

                error: function (oError) {
                  var oSapMessage = JSON.parse(oError.responseText);
                  var msg = oSapMessage.error.message.value;
                  MessageToast.show(msg)


                }
              })
            }
          }
        });
      }



    });
  });
