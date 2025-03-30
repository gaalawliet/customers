sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/UIComponent",
    "sap/m/PDFViewer"
], function (Controller, JSONModel, UIComponent, PDFViewer) {
    "use strict";

    return Controller.extend("zcustomers.controller.View2", {
        onInit: function () {

            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute("RouteView2").attachPatternMatched(this._onObjectMatched, this);

               },

               _onObjectMatched: function (oEvent) {

                console.log(oEvent);

                debugger;

                var oLayoutModel = this.getView().getModel("layoutMod");
                oLayoutModel.setProperty("/layout", "TwoColumnsMidExpanded");
                var sTransport = oEvent.getParameter("arguments").TransportRequest;
                console.log(sTransport);
                var oView = this.getView();
                var sPath = oView.getModel().createKey("/ZRDWGP_TRANS_REQUEST_HEADER", { TransportRequest: sTransport });
                oView.bindElement({
                    path: sPath,
                    parameters: {
                      expand: "to_items"
                    },
                    events: {
                      change: this.onBindingChange.bind(this),
                      dataRequested: function () {
                        oView.setBusy(true);
                      },
                      dataReceived: function (oData) {
                        oView.setBusy(false);
                      },
                      error: function (oError) {
                        oView.setBusy(false);
                        console.error("Erro ao carregar dados:", oError);
                      },
                    },
                  });
            },

            onBindingChange: function () {
                ;
                var oView = this.getView();
                //Captura o elemento que foi realizado o Binding
                var oElementBinding = oView.getElementBinding();
         
                var oRouter = UIComponent.getRouterFor(this); //this = view corrente
         
                //Se não existir um elemento (registro) válido, exibe a view ObjectNotFound
                if (!oElementBinding.getBoundContext()) {
                  // Se não existir o registro e não estamos na operação de Delete, realiza redirecionamento
                  //if (!this._bDelete) {
                  //  oRouter.getTargets().display("TargetObjectNotFound");
                  //  return;
                  //}
                  return;
                } else {
                  //Clonamos o registro atual
                  //this._oProduto = Object.assign(
                  //  {},
                  oElementBinding.getBoundContext().getObject();
                  //);
                }
              },

              onCloseDetailPress: function () {
                var oLayoutModel = this.getView().getModel("layoutMod");
                oLayoutModel.setProperty("/layout", "OneColumn");
         
                this.getOwnerComponent().getRouter().navTo("RouteView1", {}, true);
         
              },

              onPrintTransportRequest: function () {

                debugger;
                var sTransport = this.getView().getBindingContext().getProperty("TransportRequest");
         
                this._PreviewSmartform("ZGPFBP-FORM_TRANSPORT_REQUEST", { TRANSPORT_REQUEST: sTransport, });
              },

              _PreviewSmartform: function (
                FormId,
                Params,
                Title = "PDF",
                FileName = "Teste",
                GetPDF = "X"
              ) {
                var Viewer = new PDFViewer();
         
                this.getView().addDependent(Viewer);
                let oModel = this.getView().getModel();
         
                let sPath = oModel.createKey("/PrintLabelSet", {
                  FormId: FormId,
                  Params: JSON.stringify(Params),
                  FileName: FileName,
                  GetPdf: GetPDF,
                });
         
                let sSource = this.getView().getModel().sServiceUrl + sPath + "/$value";
         
                Viewer.setShowDownloadButton(false);
                Viewer.setSource(sSource);
         
                Viewer.setTitle(Title);
                Viewer.open();
              },
         
    });
});