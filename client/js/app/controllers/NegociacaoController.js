class NegociacaoController {
    
    constructor() {
        
        let $ = document.querySelector.bind(document);
        
        this._inputData = $('#data');
        this._inputQuantidade = $('#quantidade');
        this._inputValor = $('#valor');
         
        this._listaNegociacoes = new Bind(
            new ListaNegociacoes(), 
            new NegociacoesView($('#negociacoesView')), 
            'adiciona', 'esvazia');
       
        this._mensagem = new Bind(
            new Mensagem(), new MensagemView($('#mensagemView')),
            'texto');       
    }

    importarNegociacoes(){
        let service = new NegociacaoService();

        Promise.all(
            service.obterNegociacaoSemana,
            service.obterNegociacaoSemanaAnterior,
            service.obterNegociacaoSemanaRetrasada
        ).then(negociacoes => {
            negociacoes.reduce((ArrayAchatado, array) => { return ArrayAchatado.concat(array)}, [])
            .forEach(negociacao => this._listaNegociacoes.adiciona(negociacao));
        }).catch(erro => this._mensagem.texto = erro);

        
        service.obterNegociacaoSemana((erro, negociacoes )=>{
            if(erro){
                this._mensagem.texto = erro;
                return
            }

            negociacoes.forEach( negociacao => this._listaNegociacoes.adiciona(negociacao));
            this._mensagem.texto = 'Negociações adicionadas com sucesso';
        });
        

    }
    
    adiciona(event) {
        
        event.preventDefault();
        this._listaNegociacoes.adiciona(this._criaNegociacao());
        this._mensagem.texto = 'Negociação adicionada com sucesso'; 
        this._limpaFormulario();   
    }
    
    apaga() {
        
        this._listaNegociacoes.esvazia();
        this._mensagem.texto = 'Negociações apagadas com sucesso';
    }
    
    _criaNegociacao() {
        
        return new Negociacao(
            DateHelper.textoParaData(this._inputData.value),
            this._inputQuantidade.value,
            this._inputValor.value);    
    }
    
    _limpaFormulario() {
     
        this._inputData.value = '';
        this._inputQuantidade.value = 1;
        this._inputValor.value = 0.0;
        this._inputData.focus();   
    }
}