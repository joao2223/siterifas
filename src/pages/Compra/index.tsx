import { useEffect, useState } from "react";
import Modal from "react-modal";
import QRCode from "qrcode.react";
import logo from "../../assets/logo.svg";
import styles from "./Compra.module.scss";
import selecionar from "../../assets/Compra/selecionar.svg";
import { Link, useNavigate, useParams } from "react-router-dom";
import IRifa from "../../interfaces/IRifa";
import axios from "axios";
import mensagem_comprar from '../../assets/Compra/mensagem_comprar.svg';
import http from "../../http";

Modal.setAppElement("#root");

export default function Compra() {
    const [quantidade, setQuantidade] = useState(0);
    const [modalOpen, setModalOpen] = useState(false);
    const { id } = useParams();
    const [rifa, setRifa] = useState<IRifa | null>(null);
    const navigate = useNavigate();

    const incrementar = (valorIncremento: number) => {
        setQuantidade((prevQuantidade) => prevQuantidade + valorIncremento);
    };

    const decrementar = (valorIncremento: number) => {
        setQuantidade((prevQuantidade) => Math.max(prevQuantidade - valorIncremento, 0));
    };

    useEffect(() => {
        axios.get(`https://site-de-rifas-0c8b9c43956a.herokuapp.com/raffles/${id}`)
            .then((resposta) => {
                setRifa(resposta.data);
            })
            .catch((erro) => {
                console.log(erro);
            });
    }, [id]);

    useEffect(() => {
        function voltaInicio() {
            navigate("/", { replace: true });
        }
        window.addEventListener("popstate", voltaInicio);
        return () => {
            window.removeEventListener("popstate", voltaInicio);
        };
    }, []);

    const formatarPreco = (preco: string) => {
        return parseFloat(preco.replace("R$", "").replace(",", "."));
    };

    const totalCompra = rifa ? quantidade * formatarPreco(rifa.price) : 0;

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const name = event.currentTarget.nome.value;
        const phone = event.currentTarget.telefone.value;
        
        const  formData = { "name":name,"phone": phone}

        axios.post("https://site-de-rifas-0c8b9c43956a.herokuapp.com/users", formData)
            .then((response) => {
                console.log(response.data);

                const idGeradoPeloPrimeiroPost = response.data.id;
                realizarSegundoPost(idGeradoPeloPrimeiroPost);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const realizarSegundoPost = (dados: number) => {
        const clientId = dados;
        const  formData = { "clientId":clientId}
        console.log(formData)

        axios.post("https://site-de-rifas-0c8b9c43956a.herokuapp.com/orders", formData)
            .then((response) => {
                console.log(response.data);
                realizarTerceiroPost(clientId);
                closeModal();
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const realizarTerceiroPost = (clientId: number) => {
        const  formData = { "OrderId": clientId, "raffleId":id, "quantity": quantidade }
        console.log(formData);
        
        axios.post("https://site-de-rifas-0c8b9c43956a.herokuapp.com/order-items/create", formData)
            .then((response) => {
                console.log(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const finalizarCompra = () => {
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
    };

    return (
        <>
            <div className={styles.cabecalho}>
                <img src={logo} alt="logo Paido sorteio" className={styles.logo} />
                <div>
                    <Link className={styles.link} to='/'>Inicio</Link>
                    <Link className={styles.link} to='/rifas'>Rifas</Link>
                    <Link className={styles.link} to='/sorteios'>Sorteios</Link>
                    <Link className={styles.link} to='/minhasrifas'>Minhas rifas</Link>
                </div>
            </div>
            <div>
                <div className={styles.info_rifa}>
                    <p className={styles.titulo_modal}>Compre a sua cota</p>
                    <div className={styles.margin_titulo}>
                        <p className={styles.titulo_modal}>Rifa: {rifa?.name}</p>
                        <p className={styles.titulo_modal}>Preço: {rifa?.price}</p>
                    </div>
                </div>
            </div>

            <section className={styles.compra}>
                <div className={styles.container}>
                    <div className={styles.incremento}>
                        <div className={styles.dois_incrementos}>
                            <div className={styles.incremento_unico}>
                                <p className={styles.valor_incremento}> + 5</p>
                                <button className={styles.botao_incremento} onClick={() => incrementar(5)}>
                                    <img src={selecionar} alt="" />
                                </button>
                            </div>
                            <div className={styles.incremento_unico}>
                                <p className={styles.valor_incremento}> + 10</p>
                                <button className={styles.botao_incremento} onClick={() => incrementar(10)}>
                                    <img src={selecionar} alt="" />
                                </button>
                            </div>
                        </div>
                        <div className={styles.dois_incrementos}>
                            <div className={styles.incremento_unico}>
                                <p className={styles.valor_incremento}> + 50</p>
                                <button className={styles.botao_incremento} onClick={() => incrementar(50)}>
                                    <img src={selecionar} alt="" />
                                </button>
                            </div>
                            <div className={styles.incremento_unico}>
                                <p className={styles.valor_incremento}> + 100</p>
                                <button className={styles.botao_incremento} onClick={() => incrementar(100)}>
                                    <img src={selecionar} alt="" />
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className={styles.centraliza}>
                        <div className={styles.incremento_um_em_um}>
                            <button className={styles.botao_operacao} onClick={() => decrementar(1)}>-</button>
                            <p className={styles.valor_incremento}>{quantidade}</p>
                            <button className={styles.botao_operacao} onClick={() => incrementar(1)}>+</button>
                        </div>
                    </div>
                    <div className={styles.centraliza}>
                        <div className={styles.total_compra}>
                            <p>TOTAL</p>
                            <p className={styles.valor_total}>R$ {totalCompra.toFixed(2)}</p>
                        </div>
                    </div>
                    <button className={styles.botao_finalizar} onClick={finalizarCompra}>
                        Finalizar Compra
                    </button>
                </div>
            </section>

            <Modal
                isOpen={modalOpen}
                onRequestClose={closeModal}
                contentLabel="Modal de Compra"
                className={styles.modal}
                overlayClassName={styles.overlay}
            >
                <div className={styles.cabecalho_modal}>
                    <h2 className={styles.titulo_modal}>Insira seus dados para finalizar a compra</h2>
                    <button onClick={closeModal} className={styles.botao_fecha_modal}>
                        X
                    </button>
                </div>
                <div className={styles.container_modal}>
                    <div>
                        <form className={styles.formulario_finaliza_compra} onSubmit={handleSubmit}>
                            <label className={styles.nome_campo_formulario}>Nome:</label>
                            <input className={styles.input_formulario} type="text" placeholder="Nome" required name="nome" />

                            <label className={styles.nome_campo_formulario}>Telefone:</label>
                            <input className={styles.input_formulario} type="text" placeholder="Telefone" required name="telefone" />

                            <label className={styles.nome_campo_formulario}>Insira o comprovante de pagamento:</label>
                            <input className={styles.input_formulario_file} type="file" name="fileInput" id="fileInput" required />
                            <button className={styles.botao_enviar}>Enviar</button>
                        </form>
                        <div>
                            <p className={styles.texto_pix}>Faça um pix com o valor da compra: R$ {totalCompra.toFixed(2)}</p>
                            <QRCode value={totalCompra.toFixed(2)} size={200} />
                        </div>
                    </div>

                    <div>
                        <img src={mensagem_comprar} alt="" className={styles.mensagem_comprar} />
                    </div>
                </div>
            </Modal>
        </>
    );
}