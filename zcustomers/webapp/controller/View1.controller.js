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
                this.gbEditing = false;
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
                var oModelCustomer = this.getView().getModel("Customer");
                var oModel = this.getView().getModel();


                

                if (!this.gbEditing) {
                    oModel.create("/JsonCommSet", oModelCustomer.getData(), {
                        success: function (oData, oResponse) {
                            if (oResponse.statusCode == "201") {
                                var msg = "Criado com Sucesso"
                                MessageBox.success(msg);
                                this.clearModel(oModelCustomer);
                                this.handleCancelBtnPress();
                            }
                        }.bind(this),

                        error: function (oError) {
                            var oSapMessage = JSON.parse(oError.responseText);
                            var msg = oSapMessage.error.message.value;
                            MessageBox.error(msg);
                        },
                    });
                } else {
                    var oCurrentCustomer = oModelCustomer.getData();
                    var sUpdate = oModel.createKey("/JsonCommSet", {
                        Id: oCurrentCustomer.Id,
                    });

                    oModel.update(sUpdate, oCurrentCustomer, {
                        method: "PUT",
                        success: function (data, oResponse) {
                            var msg = "Atualizado com sucesso!";
                            MessageBox.success(msg);
                            this.clearModel(oModelCustomer);
                            this.handleCancelBtnPress();
                            oModel.refresh();
                        }.bind(this),

                        error: function (oError) {
                            var oSapMessage = JSON.parse(oError.responseText);
                            var msg = oSapMessage.error.message.value;
                            MessageBox.error(msg);
                        }.bind(this),

                    });
                }
            },
            handleCancelBtnPress: function () {
                this.byId("openDialog").close();
                var modelCustomer = this.getView().getModel("Costumer");
                this.clearModel(modelCustomer);
            },

            clearModel: function (oModel) {
                oModel.setData({
                    Nome: "",
                    Telefone: "",
                    Endereço: "",

                });
            },
    
            onDeleteCustomer: function() {
                var CustomerData = [];
                var oView = this.getView();
                var oSmartTableTable = oView.byId("st_customers").getTable();
                var oSmartTable = oView.byId("st_customers");
            
                MessageBox.confirm("Deseja realmente excluir os dados do cliente?", {
                    title: "Atenção",
                    icon: sap.m.MessageBox.Icon.WARNING,
                    onClose: function(oAction) {
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
