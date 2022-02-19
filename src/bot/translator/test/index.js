const Translator = require('../src');
const resources = require('./resources');

Translator.init({ resources });

const test1 = Translator.t('missingPermission', { PERMISSIONS: ['CREATE_INSTANT_INVITE'] });

if (test1 !== 'I don\'t have permission to `Create Invite` on this server.') throw Error(test1);

const test2 = Translator.t('role', { locale: 'pt' });

if (test2 !== 'cargo') throw Error(test2);

const test3 = Translator.t('permissions', { locale: 'pt' });

if (test3 !== 'permissions') throw Error(test3);

const test = Translator.t('test', { size: 50, PERMISSIONS: ['ADD_REACTIONS', 'ADMINISTRATOR'], string: 'update' });

if (test !== '50 Add Reactions update') throw Error(test);

const permissions = require('./permissions.json');

const test5 = permissions.map((permission) => Translator.t('PERMISSION', { locale: 'pt', PERMISSIONS: [permission] })).join(', ');

if (test5 !== 'Criar convite, Expulsar membros, Banir membros, Administrador, Gerenciar canais, Gerenciar servidor, Adicionar reações, Ver o registro de auditoria, Voz prioritária, Vídeo, Ver canais, Enviar mensagens, Enviar mensagens em Texto-para-voz, Gerenciar mensagens, Inserir links, Anexar arquivos, Ver histórico de mensagens, Mencionar @everyone, @here, e todos os cargos, Usar emojis externos, Ver Análises do Servidor, Conectar, Falar, Silenciar membros, Ensurdecer membros, Mover membros, Usar detecção de voz, Alterar apelido, Gerenciar apelidos, Gerenciar cargos, Gerenciar webhooks, Gerenciar emojis e figurinhas, Usar comandos de aplicativo, Pedir para falar, Gerenciar eventos, Gerenciar tópicos, Usar tópicos públicos, Criar tópicos públicos, Usar tópicos privados, Criar tópicos privados, Usar figurinhas externas, Enviar mensagens em tópicos, Começar atividades, Membros de castigo') throw Error(test5);

console.log('Passed!');