// ── COLE ESTE CÓDIGO NO APPS SCRIPT ──
// Apague tudo que tiver lá e cole este código inteiro.

const SHEET_ID = '1fwOuvf1PH_zUXVnBLFa-ATCYMxGr3OvV6UZV8-HtU9M';
const ABA = 'PA';

// Colunas da planilha:
// A=Prontuário  B=Nome  C=Data  D=Cadastro  E=Triagem  F=Médico
// G=Medicação   H=Alta  I=Internação (AIH)  J=Leito Cedido  K=Chegada no Leito
const COLUNAS = {
  'Cadastro':          4,  // D
  'Triagem':           5,  // E
  'Médico':            6,  // F
  'Medicação':         7,  // G
  'Alta':              8,  // H
  'Internação':        9,  // I
  'Leito Cedido':     10,  // J
  'Chegada no Leito': 11,  // K
  'Teste':             4,  // coluna D (só para testar conexão)
};

function doGet(e) {
  try {
    const prontuario = (e.parameter.prontuario || '').trim();
    const nome       = (e.parameter.nome       || '').trim();
    const etapa      = (e.parameter.etapa      || '').trim();
    const dataHora   = (e.parameter.dataHora   || '').trim();

    if (!prontuario || !etapa || !dataHora) {
      return resposta({ ok: false, msg: 'Parâmetros ausentes' });
    }

    const ss    = SpreadsheetApp.openById(SHEET_ID);
    const sheet = ss.getSheetByName(ABA);
    const dados = sheet.getDataRange().getValues();

    let linhaIdx = -1;
    for (let i = 1; i < dados.length; i++) {
      if (String(dados[i][0]).trim() === String(prontuario)) {
        linhaIdx = i + 1;
        break;
      }
    }

    if (linhaIdx === -1) {
      const ultimaLinha = sheet.getLastRow() + 1;
      sheet.getRange(ultimaLinha, 1).setValue(prontuario);
      sheet.getRange(ultimaLinha, 2).setValue(nome);
      const soData = dataHora.split(' ')[0];
      sheet.getRange(ultimaLinha, 3).setValue(soData);
      linhaIdx = ultimaLinha;
    }

    const col = COLUNAS[etapa];
    if (col) {
      sheet.getRange(linhaIdx, col).setValue(dataHora);
    }

    return resposta({ ok: true, msg: 'Registrado', prontuario, etapa, dataHora });

  } catch(err) {
    return resposta({ ok: false, msg: err.toString() });
  }
}

function resposta(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
