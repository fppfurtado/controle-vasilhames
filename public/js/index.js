const inventario = {
    qtdVasilhamesCheiosDiaAnterior: 0,
    qtdVasilhamesVaziosDiaAnterior: 0,
    qtdVasilhamesInutizadosDiaAnterior: 0,
    qtdVasilhamesCheiosDiaAtual: 0,
    qtdVasilhamesVaziosDiaAtual: 0,
    qtdVasilhamesInutizadosDiaAtual: 0
};

function carregarInventario(data) {

    console.log("[VERIFICAR INVENTARIO]");

    // consulta se já existe o inventário do dia
    firebase.firestore().collection("inventarios")
    .where("data", "==", data)
    .get()
    .then((querySnapshot) => {
        
        // se não existir...
        if(querySnapshot.empty) {
            //console.log("inventario do dia não existe");
            //inventario.data = firebase.firestore.Timestamp.fromDate(new Date());
            inventario.data = data;
            
            // carrega o inventario do dia anterior...
            carregarDocumentos("inventarios")
            .then((querySnapshot) => {

                querySnapshot.query.where("data", "==", getLastDayDate(data))
                .get()
                .then((querySnapshot) => {

                    querySnapshot.forEach((doc) => {

                        let invent = doc.data();

                        //console.log(doc);
                        // copia os quantitativos do dia anterior para o inventario atual

                        inventario.qtdVasilhamesCheiosDiaAnterior = 
                            eval(invent.qtdVasilhamesCheiosDiaAnterior) 
                            + eval(invent.qtdVasilhamesCheiosDiaAtual);
                        
                        inventario.qtdVasilhamesVaziosDiaAnterior = 
                            eval(invent.qtdVasilhamesVaziosDiaAnterior) 
                            + eval(invent.qtdVasilhamesVaziosDiaAtual);

                        inventario.qtdVasilhamesInutizadosDiaAnterior = 
                            eval(invent.qtdVasilhamesInutizadosDiaAnterior) 
                            + eval(invent.qtdVasilhamesInutizadosDiaAnterior);

                        //criarDocumento("inventarios", inventario);

                    })

                })
            })
            .catch((error) => {
                console.log("Error on getting inventarios: " + error);
            })

            criarDocumento("inventarios", inventario)
            .then((docId) => {
                //console.log(docId);
                inventario.id = docId;
            });
            
        } else {
            //console.log("inventario do dia já existe");
            querySnapshot.forEach((doc) => {

                let invent = doc.data();

                inventario.id = doc.id;
                inventario.data = invent.data;
                inventario.qtdVasilhamesCheiosDiaAnterior = invent.qtdVasilhamesCheiosDiaAnterior;
                inventario.qtdVasilhamesCheiosDiaAtual = invent.qtdVasilhamesCheiosDiaAtual;
                inventario.qtdVasilhamesVaziosDiaAnterior = invent.qtdVasilhamesVaziosDiaAnterior;
                inventario.qtdVasilhamesVaziosDiaAtual = invent.qtdVasilhamesVaziosDiaAtual;
                inventario.qtdVasilhamesInutizadosDiaAnterior = invent.qtdVasilhamesInutizadosDiaAnterior;
                inventario.qtdVasilhamesInutizadosDiaAtual = invent.qtdVasilhamesInutizadosDiaAtual;

            })

            // console.log("inventario:");
            // console.log(inventario);

        }

    })
    .catch((error) => {
        console.log("Error on getting inventarios: "+error);
    })

}

function criarDocumento(colecao, documento) {

    console.log("[CRIAR DOCUMENTO]");
    
    return new Promise((resolve, reject) => {
        
        if(!!documento.id) {

            firebase.firestore().collection(colecao).doc(documento.id)
                .get()
                .then((documentSnapshot) => {

                    if(!documentSnapshot.exist) {
                    firebase.firestore().collection(colecao).doc(documento.id).set(documento)
                        .then((docRef) => {            
                            resolve(documento.id);
                        })
                        .catch((error) => {
                            //console.error("Error adding document: ", error);
                            reject(error);
                        });

                    } else {
                        alert("Registro já cadastrado: " + documentSnapshot);
                    }
                    
                })
                .catch((error) => {
                    //console.log("Error getting documents: ", error);
                    reject(error)
                });

        } else {

            firebase.firestore().collection(colecao).add(documento)
            .then((docRef) => {
                //console.log("documento registrado: "+docRef.id);
                resolve(docRef.id);
            })
            .catch((error) => {
                //console.log("erro no registro do documento: "+error);
                reject(error);
            })

        }        

    })

}

function carregarDocumentos(colecao, id = null) {

    console.log("[CARREGAR DOCUMENTOS]");

    return new Promise((resolve, reject) => {

        let colecaoRef = firebase.firestore().collection(colecao);

        if(!!id) {

            colecaoRef.doc(id).get()
            .then((documentSnapshot) => {
                //console.log(documentSnapshot);
                resolve(documentSnapshot);
            })
            .catch((error) => {
                reject(error);
            })

        } else{

            colecaoRef.get()
            .then((querySnapshot) => {
                //console.log(querySnapshot);
                resolve(querySnapshot);
            })
            .catch((error) => {
                reject(error);
            })

        }

    });

}

function atualizarDocumento(colecao, documento, id) {

    console.log("[ATUALIZAR DOCUMENTO]");

    console.log("atualizando documento: "+ id);
    firebase.firestore().collection(colecao).doc(id).set(documento)
            .then((docRef) => {
                console.log("Documento atualizado");
            })
            .catch((error) => {
                console.error("Error adding document: " + error);
            });

}

function excluirDocumento(colecao, id) {

    console.log("[EXCLUIR DOCUMENTO]");

    firebase.firestore().collection(colecao).doc(id).delete().then(() => {
        console.log("Document successfully deleted!");
        window.location.assign("lista-romaneios.html");
    }).catch((error) => {
        console.error("Error removing document: ", error);
    });
}

function formatarData(data, formato = "br") {

    console.log("[FORMATAR DATA]");

    let epochTimestamp = data.seconds + "000";
    let dataJS = new Date(eval(epochTimestamp));
    //let dia = formatarZeroAEsquerda(dataJS.getDate());
    let ano = dataJS.getFullYear();
    let mes = String(dataJS.getMonth()+1).padStart(2, "0");
    let dia = String(dataJS.getDate()).padStart(2, "0");
    let horas = dataJS.getHours();
    let minutos = dataJS.getMinutes();
    //let mes = formatarZeroAEsquerda(dataJS.getMonth()+1);
    
    let dataFormatada = formato == "br" ? 
    dia  + "/" + mes + "/" + ano : 
    ano + "-" + mes + "-" + dia + "T" + horas + ":" + minutos; 

    return dataFormatada;

}

function getLastDayDate(date) {
    return new Date(date.getTime() - 24*60*60*1000);
}

function getTodayDate() {

    let hoje = new Date();
    let ano = hoje.getFullYear().toString();
    let mes = String(hoje.getMonth()+1).padStart(2, "0");
    let dia = String(hoje.getDate()).padStart(2, "0");

    return new Date(ano + "-" + mes + "-" + dia + " 00:00");
}

function getUrlParameter(sParam) {

    console.log("[GET URL PARAMENTER]");

    var sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }
    return false;
}

function atualizarInventario(qtdVasilhamesCheiosDiaAtual, qtdVasilhamesVaziosDiaAtual, qtdVasilhamesInutizadosDiaAtual) {

    console.log("[ATUALIZAR INVENTARIO]")

    console.log(inventario);

    inventario.qtdVasilhamesCheiosDiaAtual += eval(qtdVasilhamesCheiosDiaAtual);
    inventario.qtdVasilhamesVaziosDiaAtual += eval(qtdVasilhamesVaziosDiaAtual);
    inventario.qtdVasilhamesInutizadosDiaAtual += eval(qtdVasilhamesInutizadosDiaAtual);
    
    atualizarDocumento("inventarios", inventario, inventario.id);

}