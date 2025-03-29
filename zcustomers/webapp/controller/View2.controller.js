sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
], function (Controller, JSONModel) {
    "use strict";

    return Controller.extend("zcustomers.controller.View2", {
        onInit: function () {
            // Dados fictícios para exibição
            var aMockData = [
                {
                    TransportRequest: "TR001",
                    Delivery: "DEL001",
                    DeliveryItem: "001",
                    Material: "MAT001",
                    MaterialDescription: "Material Teste 1",
                    MaterialQuantity: 10,
                    GrossWeight: 5.5,
                    UnitMeasure: "KG"
                },
                {
                    TransportRequest: "TR002",
                    Delivery: "DEL002",
                    DeliveryItem: "002",
                    Material: "MAT002",
                    MaterialDescription: "Material Teste 2",
                    MaterialQuantity: 20,
                    GrossWeight: 10.0,
                    UnitMeasure: "KG"
                }
            ];

            // Cria o modelo JSON com os dados fictícios
            var oMockModel = new JSONModel(aMockData);

            // Define o modelo na View2
            this.getView().setModel(oMockModel, "ItemsModel");
        },

        onRefresh: function () {
            // Lógica para atualizar os dados (simulação)
            var oModel = this.getView().getModel("ItemsModel");
            oModel.refresh();
        },

        onExport: function () {
            // Lógica para exportar os dados (simulação)
            console.log("Exportar dados da tabela");
        },

        onBack: function () {
            // Navega de volta para a View1
            this.getOwnerComponent().getRouter().navTo("RouteView1");
        }
    });
});