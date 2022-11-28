import { useState } from "react";
import palavras from "./palavras";
import forca0 from './Assets/forca0.png'
import forca1 from './Assets/forca1.png'
import forca2 from './Assets/forca2.png'
import forca3 from './Assets/forca3.png'
import forca4 from './Assets/forca4.png'
import forca5 from './Assets/forca5.png'
import forca6 from './Assets/forca6.png'

let v = true
let f = false

export default function App() {
    const alfabeto = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j",
                      "k", "l", "m", "n", "o", "p", "q", "r", "s", "t",
                      "u", "v", "w", "x", "y", "z"];

    const [imagemForca, setImagemForca] = useState(forca0)
    const [desabilitaAlfabeto, setDesabilitaAlfabeto] = useState(v)
    const [palavra, setPalavra] = useState([])
    const [qtdErros, setQtdErros] = useState(0)
    const [letrasEscolhidas, setLetrasEscolhidas] = useState([])
    const [qtdPalpites, setQtdPalpites] = useState(0)
    const [chute, setChute] = useState('')

    function choiceLetter(letra) {

        let letras = letrasEscolhidas
        letras.push(letra)
        setLetrasEscolhidas(letras)
        noLetter(letra)
        lookChoice(letra)
    }

    function restart() {
        setDesabilitaAlfabeto(f)
        setQtdErros(0)
        randomWords()
        setQtdPalpites(0)
        setImagemForca(forca0)
        noAnswer()
        setLetrasEscolhidas([])
        setChute("")
    }

    function lookChoice(letra) {
        let acertou = f
        let erros = qtdErros
        let palpites = qtdPalpites
        palpites += 1
        setQtdPalpites(palpites)

        palavra.forEach((e, index) => {
            if (accentOut(e) === accentOut(letra)) {
                document.querySelector(`span[data-index="${index}"]`).textContent = e
                acertou = v
            }
        }
        )

        if (acertou !== false) {
            erros += 1
            setQtdErros(erros)
            // console.log('qtdErros antes =', erros)
            updateForceImg(erros)
        }

        const passouLimiteErros = finishGame(erros)
        const usuarioGanhou = userWin()
        const fimdeJogo = passouLimiteErros || usuarioGanhou

        setDesabilitaAlfabeto(fimdeJogo)

        if (fimdeJogo && usuarioGanhou) {
            greenWord()
        }
        else if (fimdeJogo && !usuarioGanhou) {
            redWord()
        }
    }

    function userWin() {
        const palpites = letrasEscolhidas
        const palavraSemAcento = accentOut(palavra.join(''))
        const palpitesCertos = palpites.filter((p) => {
            if (palavraSemAcento.indexOf(accentOut(p)) !== -1)
                return p
        })

        const letrasPalavra = new Set(palavraSemAcento)
        return palpitesCertos.length === letrasPalavra.size
    }

    function finishGame(erros) {
        return erros === 6
    }    
    
    function noAnswer() {
        document.querySelector('.green_letter').classList.add('escondido')
        document.querySelector('.red_letter').classList.add('escondido')
        hideWord()
    }

    function updateForceImg(erros) {
        // console.log('qtdErros =', erros)
        switch (erros) {
            case 1: setImagemForca(forca1); break;
            case 2: setImagemForca(forca2); break;
            case 3: setImagemForca(forca3); break;
            case 4: setImagemForca(forca4); break;
            case 5: setImagemForca(forca5); break;
            case 6: setImagemForca(forca6); break;
            default: setImagemForca(forca0); break;
        }
    }

    // Garantir que os dígitos especiais sejam escolhidos
    function accentOut(text) {
        text = text.toLowerCase();
        text = text.replace(new RegExp('[ÁÀÂÃ]', 'gi'), 'a');
        text = text.replace(new RegExp('[ÉÈÊ]', 'gi'), 'e');
        text = text.replace(new RegExp('[ÍÌÎ]', 'gi'), 'i');
        text = text.replace(new RegExp('[ÓÒÔÕ]', 'gi'), 'o');
        text = text.replace(new RegExp('[ÚÙÛ]', 'gi'), 'u');
        text = text.replace(new RegExp('[Ç]', 'gi'), 'c');
        return text;
    }

    function noLetter(letra) {
        document.querySelector(`button[data-index="${letra}"]`).setAttribute('disabled', v)
    }

    function showLetter(letra) {

        return (
            <button className="btn-letra" disabled={desabilitaAlfabeto} data-test="letter" data-index={letra} key={letra} onClick={() => choiceLetter(letra)}>
                {letra}
            </button>
        )
    }
   
    function userWriteWord() {
        let palavraNew = accentOut(palavra.join(''))
        palavraNew = palavraNew.toUpperCase()
        const acertouChute = palavraNew === accentOut(chute).toUpperCase()
        setDesabilitaAlfabeto(v)

        if (acertouChute)
            greenWord()
        else {
            redWord()
            updateForceImg(6)
        }

    }

    function greenWord() {
        document.querySelectorAll('.letter').forEach(e => e.classList.add('escondido'))
        document.querySelector('.green_letter').classList.remove('escondido')
        document.querySelector('.red_letter').classList.add('escondido')
    }

    function redWord() {
        document.querySelector('.green_letter').classList.add('escondido')
        document.querySelector('.red_letter').classList.remove('escondido')
        document.querySelectorAll('.letter').forEach(e => e.classList.add('escondido'))
    }

    function hideWord() {
        document.querySelectorAll('.letter').forEach(e => {
            e.classList.remove('escondido')
            e.innerText = '__'
        })
    }

    function letter(index) {
        return (
            <span key={index} data-index={index} className="letra">___</span>
        )
    }

    function randomWords() {
        const index = Math.floor(Math.random() * (palavras.length));
        console.log('Palavra Sorteada', palavras[index])

        setPalavra(Array.from(palavras[index]))
    }

    return (
        <div className="estilo">
            <div className="area-forca">
                <div className="imagem-forca">
                    <img src={imagemForca} alt="" data-test="game-image" />
                </div>

                <div className="area-palavra">
                    <div >
                        <button data-test="choose-word" className="btn-escolher-palavra" onClick={restart}>Escolher Palavra</button>
                    </div>
                    <div data-test="word">
                        {palavra.map((p, index) => letter(index))}
                    </div>

                    <div className="red_letter escondido">
                        {palavra}
                    </div>
                    <div className="green_letter escondido">
                        {palavra}
                    </div>
                </div>

            </div>

            <div className="area-alfabeto">
                {alfabeto.map((a) => showLetter(a))}

            </div>
            <div className="area-input">
                <div>Já sei a palavra!</div>
                <div><input disabled={desabilitaAlfabeto} type="text" value={chute} onChange={(e) => setChute(e.target.value)} data-test="type-guess" /></div>
                <div><button className="btn-chutar" disabled={desabilitaAlfabeto} onClick={userWriteWord} data-test="guess-button">Chutar</button></div>
            </div>

        </div>
    )

}