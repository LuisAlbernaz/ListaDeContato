import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { Modal, Button } from 'react-bootstrap';

export default function ListaContatos() {
  const [dadosContatos, setDadosContato] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [novoContato, setNovoContato] = useState({ nome: '' });
  const [contatoEditando, setContatoEditando] = useState({
    id: null,
    nome: '',
    telefone: '',
    email: '',
    dataNascimento: '',
  });
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    carregarContatos();
  }, []);

  const carregarContatos = async () => {
    try {
      const response = await axios.get('http://localhost:3030/api/contatos');
      setDadosContato(response.data);
    } catch (error) {
      console.error('Erro ao carregar contatos:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3030/api/contatos/${id}`);
      carregarContatos();
    } catch (error) {
      console.error('Erro ao excluir Contato:', error);
    }
  };

  const handleCadastrarContato = async () => {
    try {
      const response = await axios.post('http://localhost:3030/api/contatos', {
        nome: novoContato.nome,
        email: novoContato.email,
        telefone: novoContato.telefone,
        dataNascimento: novoContato.dataNascimento,
      });
      console.log(response.data);
      handleCloseModal();
      carregarContatos();
    } catch (error) {
      console.error('Erro ao cadastrar contato:', error);
    }
  };

  const handleShowModal = (contato) => {
    setContatoEditando(contato);
    setShowEditModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setNovoContato({ nome: '' });
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setContatoEditando({
      id: null,
      nome: '',
      telefone: '',
      email: '',
      dataNascimento: '',
    });
  };

  const handleEditar = async () => {
    try {
      await axios.patch(`http://localhost:3030/api/contatos/${contatoEditando.id}`, {
        nome: contatoEditando.nome,
        email: contatoEditando.email,
        telefone: contatoEditando.telefone,
        dataNascimento: contatoEditando.dataNascimento,
      });
      handleCloseEditModal();
      carregarContatos();
    } catch (error) {
      console.error('Erro ao editar contato:', error);
    }
  };
  

  return (
    <div className="container text center">
      <h2 style={{ fontFamily: 'Tahoma, sans-serif' }}>Lista de Contatos</h2>
      <button className="btn btn-success" onClick={() => setShowModal(true)}>
        Novo Contato
      </button>
      <table className="table">
        <tbody>
          {dadosContatos.map((contato) => (
            <tr key={contato.id}>
              <td>
                <div className="card mb-3" style={{ maxWidth: '540px' }}>
                  <div className="row g-0">
                    <div className="col-md-4 d-flex justify-content-center align-items-center">
                      <p>ID: {contato.id}</p>
                      <img
                        src="https://cdn-icons-png.flaticon.com/512/15/15895.png"
                        alt={contato.nome}
                        className="img-fluid rounded-start"
                        style={{ width: '100px', height: '100px', marginLeft: '1rem' }}
                      />
                    </div>
                    <div className="col-md-8">
                      <div className="card-body">
                        <p className="card-title">Nome: {contato.nome}</p>
                        <p className="card-text">Telefone: {contato.telefone}</p>
                        <p className="card-text">Email: {contato.email}</p>
                        <p className="card-text">
                          Data de Nascimento: {format(new Date(contato.dataNascimento), 'dd-MM-yyyy')}
                        </p>
                      </div>
                      <div>
                        <button
                          type="button"
                          className="btn btn-danger mr-2"
                          onClick={() => handleDelete(contato.id)}
                          style={{ width: '80px', height: '30px', borderRadius: '5px', marginRight: '5px' }}
                        >
                          Excluir
                        </button>
                          <button
                            type="button"
                            className="btn btn-warning"
                            onClick={() => handleShowModal(contato)}
                            style={{ width: '80px', height: '30px', borderRadius: '5px' }}
                          >
                            Editar
                          </button>
                      </div>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Cadastrar Contato</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <label>Nome do Contato:</label>
            <input
              type="text"
              className="form-control"
              value={novoContato.nome}
              onChange={(e) => setNovoContato({ ...novoContato, nome: e.target.value })}
            />
            <label>Email do Contato:</label>
            <input
              type="text"
              className="form-control"
              value={novoContato.email}
              onChange={(e) => setNovoContato({ ...novoContato, email: e.target.value })}
            />
            <label>Telefone:</label>
            <input
              type="text"
              className="form-control"
              value={novoContato.telefone}
              onChange={(e) => setNovoContato({ ...novoContato, telefone: e.target.value })}
            />
            <label>Data de Nascimento:</label>
            <input
              type="text"
              className="form-control"
              value={novoContato.dataNascimento}
              onChange={(e) => setNovoContato({ ...novoContato, dataNascimento: e.target.value })}
            />
          </Modal.Body>
          <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseModal}>
                Fechar
              </Button>
              <Button variant="primary" onClick={handleCadastrarContato}>
                Salvar
              </Button>
            </Modal.Footer>
        </Modal>

        {/* Modal de Edição */}

      <Modal show={showEditModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Contato</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <label>Nome:</label>
          <input
            type="text"
            value={contatoEditando.nome}
            onChange={(e) => setContatoEditando({ ...contatoEditando, nome: e.target.value })}
          />
          <label>Telefone:</label>
          <input
            type="text"
            value={contatoEditando.telefone}
            onChange={(e) => setContatoEditando({ ...contatoEditando, telefone: e.target.value })}
          />
          <label>Email:</label>
          <input
            type="text"
            value={contatoEditando.email}
            onChange={(e) => setContatoEditando({ ...contatoEditando, email: e.target.value })}
          />
          <label>Data de Nascimento:</label>
          <input
            type="text"
            value={contatoEditando.dataNascimento}
            onChange={(e) => setContatoEditando({ ...contatoEditando, dataNascimento: e.target.value })}
          />

        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseEditModal}>
            Fechar
          </Button>
          <Button variant="primary" onClick={handleEditar}>
            Salvar Alterações
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}



