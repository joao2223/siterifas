import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import styles from './Compra.module.scss';
import logo from '../../assets/logo.svg';
import { AiOutlineSearch } from 'react-icons/ai';
import IRifa from '../../interfaces/IRifa';
import { CiWarning } from 'react-icons/ci';
import selecionar from '../../assets/Compra/selecionar.svg';
import Modal from 'react-modal';
import style from '../Inicio/Inicio.module.scss'
import IOrders from '../../interfaces/IOrders';

export default function Compra() {
    const { id } = useParams();
    const [rifa, setRifa] = useState<IRifa>();
    const [quantidade, setQuantidade] = useState(0);
    const [resultadosBusca, setResultadosBusca] = useState<IOrders[]>([]);
    const [termoDeBusca, setTermoDeBusca] = useState<string>("");
    const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
    const [orders, setOrders] = useState<IOrders[]>();
    const [quantidadeRifas, setQuantidadeRifas] = useState(Number)
    const navigate = useNavigate()


    function redirecionarParaPaginaComprarAgora(id: number) {
        navigate('/paginaComprarAgora', {replace : true})
    }
    const [showModal, setShowModal] = useState(false);

    const incrementar = (valorIncremento: number) => {
        setQuantidade((prevQuantidade) => prevQuantidade + valorIncremento);
    };

    function procurarCliente() {
        const resultados = orders?.filter(order => order.client.phone === termoDeBusca);
        setResultadosBusca(resultados || []);
    }

    const decrementar = (valorIncremento: number) => {
        setQuantidade((prevQuantidade) => Math.max(prevQuantidade - valorIncremento, 0));
    };
    function handleOpenModal() {
        setShowModal(true);
    }

    function handleCloseModal() {
        setShowModal(false);
    }


    useEffect(() => {
        axios.get('http://localhost:8080/orders')
            .then(resposta => {
                setOrders(resposta.data);
                console.log(resposta)
            })
            .catch(erro => {
                console.log(erro);
            });
    }, []);

    useEffect(() => {
        axios.get(`http://localhost:8080/raffles/${id}`)
            .then((resposta) => {
                setRifa(resposta.data);
            })
            .catch((erro) => {
                console.log(erro);
            });
    }, [id]);

    useEffect(() => {
        axios.get(`http://localhost:8080/raffles/${id}/remaining`)
            .then((resposta) => {
                setQuantidadeRifas(resposta.data);
            })
            .catch((erro) => {
                console.log(erro);
            });
    }, [id]);

    if (!rifa) {
        return <p>Carregando...</p>;
    }

    const formatarPreco = (preco: string) => {
        return parseFloat(preco.replace("R$", "").replace(",", "."));
    };

    const totalCompra = rifa ? quantidade * formatarPreco(rifa.price) : 0;

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const name = event.currentTarget.nome.value;
        const phone = event.currentTarget.telefone.value;

        const formData = { "name": name, "phone": phone, "file": "", "userStatus" : "FALSE"}

        axios.post("http://localhost:8080/users", formData)
            .then((response) => {
                console.log(response.data);
                const idGeradoPeloPrimeiroPost = response.data.id;
                realizarSegundoPost(idGeradoPeloPrimeiroPost);
            })
            .catch((error) => {
                console.log(error, formData);
            });
    };

    const realizarSegundoPost = (dados: number) => {
        const clientId = dados;
        const formData = { "clientId": clientId }
        console.log(formData)

        axios.post("http://localhost:8080/orders", formData)
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
        const formData = { "orderId": clientId , "raffleId": id, "quantity": quantidade }
        console.log(formData);
        axios.post("http://localhost:8080/order-items", formData)
            .then((response) => {
                console.log(response.data);
                navigate(`/paginaPagamento/${clientId}`);
                closeModal()
            })
            .catch((error) => {
                console.log(error, formData);
            });
    };

    const finalizarCompra = () => {
        setCheckoutModalOpen(true);
    };

    const closeModal = () => {
        setCheckoutModalOpen(false);
    };

    return (
        <>
            <div className={style.cabecalho}>
                <img src={logo} alt="logo paido sorteio" className={style.logo} />
                <button className={style.botao_busca} onClick={handleOpenModal}>
                    <AiOutlineSearch />
                    <p className={style.nome_botao_busca}>MEUS NÚMEROS</p>
                </button>
            </div>

            <section className={styles.container_compra}>
                <img src={rifa.imgUrl} alt={rifa.description} className={styles.imagem_rifa} />
                <div>
                    <div>
                        <p className={styles.descricao_rifa}>{rifa.description}</p>
                        <p className={styles.descricao_rifa}>Quantidade de rifas disponíveis: {quantidadeRifas} </p>
                    </div>
                    <div>
                        <button className={styles.botao_preco}>
                            <p className={styles.nome_botao_preco}>Por apenas</p>
                            <p className={styles.preco_botao_preco}>{rifa.price}</p>
                        </button>
                    </div>
                    <div className={styles.automaticos}>
                        <CiWarning />
                        <div>
                            <p>Número automáticos</p>
                        </div>
                    </div>
                    <div className={styles.centraliza}>
                        <div className={styles.secao_quantidade}>
                            <p className={styles.titulo_modal}>Compre a sua cota</p>
                            <div className={styles.quantidade_escolha}>
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
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Modal
                isOpen={showModal}
                onRequestClose={handleCloseModal}
                contentLabel="Login"
                className={style.modalContent}
                overlayClassName={style.modalOverlay}
            >
                <div className={style.modalHeader}>
                    <h2>Login</h2>
                    <button className={style.modalCloseButton} onClick={handleCloseModal}>
                        <span>&times;</span>
                    </button>
                </div>
                <hr className={style.modalLine} />
                <p>Para consultar seus pedidos, digite o número de WhatsApp usado na hora da compra:</p>
                <input
                    type="text"
                    name="Telefone"
                    className={style.modalInput}
                    value={termoDeBusca}
                    onChange={(e) => setTermoDeBusca(e.target.value)}
                />
                <button className={style.modalButton} onClick={() => {
                    procurarCliente();
                    navigate(`/consulta`, { state: { telefone: termoDeBusca } });
                }}>Consultar</button>
            </Modal>

            <Modal
                isOpen={checkoutModalOpen}
                onRequestClose={closeModal}
                contentLabel="Finalizar Compra"
                className={styles.modalContent}
                overlayClassName={styles.modalOverlay}
            >
                <div className={styles.modalHeader}>
                    <h2>Checkout</h2>
                    <button className={styles.modalCloseButton} onClick={closeModal}>
                        <span>&times;</span>
                    </button>
                </div>
                <hr className={styles.modalLine} />
                <div className={styles.modalBody}>
                    <div>
                        <p>Você está comprando números para: {rifa?.description}</p>
                        <p>Finalize a compra preenchendo os campos abaixo:</p>
                        <form onSubmit={handleSubmit}>
                            <input type="text" name="nome" placeholder="Nome Completo" className={styles.modalInput} required />
                            <input type="text" name="telefone" placeholder="Seu Whatsapp" className={styles.modalInput} required />
                            <input type="text" name="confirmarWhatsapp" placeholder="Confirme seu Whatsapp" className={styles.modalInput} required />
                            <input type="email" name="email" placeholder="Seu Email" className={styles.modalInput} required />
                            <button className={styles.modalButton} type="submit">Comprar Agora</button>
                        </form>
                    </div>
                </div>
            </Modal>
        </>
    );
}