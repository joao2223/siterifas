import React, { useEffect, useState } from 'react';
import { AiOutlineSearch } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import IRifa from '../../interfaces/IRifa';
import styles from './Inicio.module.scss';
import logo from '../../assets/logo.svg';
import rifados from '../../assets/Inicio/rifados.jpg';
import sorte from '../../assets/Inicio/sorte.svg';
import Modal from 'react-modal';
import IOrders from '../../interfaces/IOrders';

export default function Inicio() {
    const [rifas, setRifas] = useState<IRifa[]>();
    const [orders, setOrders] = useState<IOrders[]>();
    const [termoDeBusca, setTermoDeBusca] = useState<string>("");
    const [resultadosBusca, setResultadosBusca] = useState<IOrders[]>([]);;
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('http://localhost:8080/raffles')
            .then(resposta => {
                setRifas(resposta.data);
            })
            .catch(erro => {
                console.log(erro);
            });
    }, []);

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

    function procurarCliente() {
        const resultados = orders?.filter(order => order.client.phone === termoDeBusca);
        setResultadosBusca(resultados || []);
    }

    function redirecionarParaCompra(id: number) {
        navigate(`/compra/${id}`, { replace: true });
    }

    function handleOpenModal() {
        setShowModal(true);
    }

    function handleCloseModal() {
        setShowModal(false);
    }

    return (
        <>
            <div className={styles.cabecalho}>
                <img src={logo} alt="logo paido sorteio" className={styles.logo} />
                <button className={styles.botao_busca}>
                    <AiOutlineSearch />
                    <p className={styles.nome_botao_busca} onClick={handleOpenModal}>MEUS NÚMEROS</p>
                </button>
            </div>

            <img src={rifados} alt="" className={styles.imagem_inicio} />

            <div className={styles.centraliza}>
                <section className={styles.container_rifas}>
                    <div className={styles.titulo_secao}>
                        <img src={sorte} alt="" className={styles.sorte} />
                        <div className={styles.texto_mais_titulo_rifas}>
                            <p className={styles.texto_titulo_rifas}>NOSSAS PREMIAÇÕES</p>
                        </div>
                    </div>
                    <div className={styles.centraliza}>
                        {rifas?.map((rifa) => (
                            rifa.raffleStatus === 'OPEN' && (
                                <button key={rifa.id} className={styles.card} onClick={() => redirecionarParaCompra(rifa.id)}>
                                    <img src={rifa.imgUrl} alt={rifa.description} className={styles.imagem_rifa} />
                                    <div className={styles.container_rifas_info}>
                                        <p className={styles.descricao}>{rifa.description}</p>
                                        <p className={styles.preco}>{rifa.price}</p>
                                        <button className={styles.disponivel}>Disponível</button>
                                    </div>
                                </button>
                            )
                        ))}
                    </div>
                </section>
            </div>

            <Modal
                isOpen={showModal}
                onRequestClose={handleCloseModal}
                contentLabel="Login"
                className={styles.modalContent}
                overlayClassName={styles.modalOverlay}
            >
                <div className={styles.modalHeader}>
                    <h2>Login</h2>
                    <button className={styles.modalCloseButton} onClick={handleCloseModal}>
                        <span>&times;</span>
                    </button>
                </div>
                <hr className={styles.modalLine} />
                <p>Para consultar seus pedidos, digite o número de WhatsApp usado na hora da compra:</p>
                <input
                    type="text"
                    name="Telefone"
                    className={styles.modalInput}
                    value={termoDeBusca}
                    onChange={(e) => setTermoDeBusca(e.target.value)}
                />
                <button className={styles.modalButton} onClick={() => {
                    procurarCliente();
                    navigate(`/consulta`, { state: { telefone: termoDeBusca } });
                }}>Consultar</button>
            </Modal>
        </>
    );
}