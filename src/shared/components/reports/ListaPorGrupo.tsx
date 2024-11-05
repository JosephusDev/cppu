import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';

// Define a interface para os dados do membro
interface MembroData {
  id: number;
  nome: string;
  municipio: string;
  cartao_militante: string;
  funcao: string;
  foto: string;
  cap: string;
}

const styles = StyleSheet.create({
  page: {
    padding: 10,
    backgroundColor: '#F5F5F5',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10, // Reduced margin to adjust for the line
  },
  logoLeft: {
    width: 70,
    height: 50,
  },
  logoRight: {
    width: 50,
    height: 50,
  },
  titleContainer: {
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000',
    marginTop: 30,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000',
    marginBottom: 10
  },
  subtitle2: {
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000',
    marginBottom: 10
  },
  line: {
    marginTop: 5,
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#000',
  },
  header2: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#555555',
  },
  table: {
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderCollapse: true,
    borderColor: '#bfbfbf',
    marginBottom: 20,
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableCol: {
    width: '25%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#bfbfbf',
    padding: 5,
  },
  tableCellHeader: {
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  tableCell: {
    fontSize: 10,
    textAlign: 'center',
    padding: 5,
    color: '#555555',
  },
  image: {
    width: 25,
    height: 25,
    borderRadius: 10,
    margin: 'auto',
  },
  footer: {
    marginTop: 20,
    fontSize: 12,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#000000',
  },
});

interface MembroPDFProps {
  data: MembroData[];
  grupo: string;
  municipio: string;
}

const FichaMembro: React.FC<MembroPDFProps> = ({ data, grupo, municipio }) => (
  <Document>
    <Page style={styles.page}>
      {/* Cabeçalho com logos e título */}
      <View style={styles.headerContainer}>
        <Image style={styles.logoLeft} src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAARMAAAC3CAMAAAAGjUrGAAAAw1BMVEUAAADMACL/3QDACCUiIiKEABbRACPOBCH+1QD/3wD/5ADKACP/4gD/5QD/5wDIACSPfADZvADWRR34xAj/2gDnixTkfhbTMh7QHiDqkxJoWgCeiQCzmwDpygCUgADfwQAjHgC/pQBFPAArJQDx0QD2vAnUPB77zgXfbBjyrg3cXhruoxDYTxzrmBLojhP6ygXRJx/idheJLhGwmQDQtAAWEwBSRwBjVgA0LQB7awC6oQAuJwBxYgBaTgBHPgAdGQANDAAIYlNaAAAEeElEQVR4nO2aa1faQBRFYfrAO5lEESxqpWKliq19au279v//qg4vSXJpAtjcO23O/oiw1mGvOTOTK40HIE+jCfLACQdOOHDCgRMOnHDghAMnHDjhwAkHTjhwwoETDpxw4IQDJxw44cAJB044cMKBEw6ccOCEAyccOOHACQdOOHDCgRMOnHDghAMnHDjhwAkHTjhwwoETDpxw4IQDJxw44cAJB044cMKBEw6ccMJx0tMOcEc4Tl5E2gnmBONkNznTjjAnFCfRQbIXykIJxsm568BJll1L9E47xIxAnEQHztgngSyUUJyck6FQTp5AnOxaY4j2tWNMCcPJuDrG2FEYCyUQJ746xrgLOFkwro4vj9HOMSUIJ9GbcXV8eV4GsVCCcLI9qY4vzys4mXMWT5QY6sLJjHl1fHkuQ5ASgpN5dXx5XsPJlF4yU2LofFs7TDMIJ4vqGJOEMG0LwclbunPiQhiiBOBkUR1fnhCGKPpO0tXx5QngOTAAJ6nqmCCGKPpO0tUxQQxR1J1Ee+nq+IXS0k4UgJMOZZ3oD1HUnWSr48ujP0TRdpKvjiGjXh51J7nqGBOrD1G0nfRsTkkAQxRlJ9Eec0JbupEqd7LfKqbJquPLc1nyoVbFd92KnYy63a1CuBJDJR/pbo2qDV2xk+jsbUxFcCXjf34VEXd6FW84Ve8nUfNVvPSLbwjFB1HVe3D1e+z2y+WrYSPclsDEVuDcifY77HDZDIovWgIHtchZHB0kf2OpkBuJjGtl7ifbl11X/p1LsJ13Mrc5oTtb1Lq451IZb64yWeXusdETdx8pIpvrDLm7fXR2vvFWS4nI5jpD8HnHX1U27A/Re8nnwsZjQZqjja4qttNrSsZsPBLlw/Ha/SF7JJvxUUOaK7veUnHdQ/GM4hyuc1Uhe/1RO7AEg/bK/SG3o51Wiqcr9sf2n2tHleNmuEJ/KDnSzinLdVyqxHzSDinNUclKob52QnmOS7aUGjq5TYqVGJN81s4ozbPS89g+1c4oTVl1fHmOtTMKMyg9dnx5anGDXVBeHV+e2txhp7RXuMjStXZKUQYrPfE47Zii7KzkxH7RzinJKtXx66RO5Tldcq9fMpWkrnZQQZZUx/b7/MW4BiO2Oaw6lHz1T4Vsqu++aicV41u+J858H79+aPK/gRxqRxUjX524fTv9w6Cdu94mN7pJ5chWh1zqYS83lXRXeilFyVbHDjNr4UdmKlmbIUq6OmRP8n++Tv/Wy9ZkSJ2qjjNLrqo7qXVUkyHK6eIr2/bpsnf8XFxVajJEuasO/XkRnNxdVagWE8h5ddyw4KD9Ml9MtRiiDKbflhK2uWY4nfWH2kK5NJlWh6h0DnA16Q/RQCCUMpPqxMeD8nd+mvwAoQZDlFtXuLlm+Di+6tdgAumrY4s21yz+qk+myjhB0HZx8eaa5WZo7ffKwoTBr6R8c81yUnJA/fs8639b9yM7/3t5NunBTU2eAwEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACwDg9Bnt9mMqsQHeVAwgAAAABJRU5ErkJggg==" /> {/* Path da bandeira à esquerda */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>COMITÉ PROVINCIAL DO UÍGE</Text>
        </View>
        <Image style={styles.logoRight} src="data:image/jpeg;base64,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" /> {/* Path do logo à direita */}
      </View>

      {/* Linha horizontal abaixo do cabeçalho */}
      <View style={styles.line} />

      <Text style={styles.subtitle}>{grupo.replace(/M-/g, "M/")}</Text>
      {municipio && (
        <Text style={styles.subtitle2}>Município: {municipio}</Text>
      )}
      <View style={styles.table}>
        {/* Cabeçalho da Tabela */}
        <View style={styles.tableRow}>
          <View style={styles.tableCol}><Text style={styles.tableCellHeader}>Nome</Text></View>
          <View style={styles.tableCol}><Text style={styles.tableCellHeader}>CAP</Text></View>
          <View style={styles.tableCol}><Text style={styles.tableCellHeader}>Cartão Militante</Text></View>
          <View style={styles.tableCol}><Text style={styles.tableCellHeader}>Função</Text></View>
        </View>

        {/* Corpo da Tabela - Iteração sobre os dados */}
        {data.map((membro) => (
          <View style={styles.tableRow} key={membro.id}>
            <View style={styles.tableCol}><Text style={styles.tableCell}>{membro.nome}</Text></View>
            <View style={styles.tableCol}><Text style={styles.tableCell}>{membro.cap}</Text></View>
            <View style={styles.tableCol}><Text style={styles.tableCell}>{membro.cartao_militante}</Text></View>
            <View style={styles.tableCol}><Text style={styles.tableCell}>{membro.funcao}</Text></View>
          </View>
        ))}
      </View>

      <Text style={styles.footer}>Sistema Integrado de Gestão do Partido - CPPU v.1.3</Text>
    </Page>
  </Document>
);

export default FichaMembro;
