export const commandExamples = [
  {
    buttonLabel: 'Texto',
    command: {
      id: '1',
      to: '128271320123982@messenger.gw.msging.net',
      type: 'text/plain',
      content: 'Seja bem-vindo ao nosso serviço! Como podemos te ajudar?'
    }
  },
  {
    buttonLabel: 'Texto contendo email',
    command: {
      id: '1',
      to: '128271320123982@messenger.gw.msging.net',
      type: 'text/plain',
      content: 'Este é um exemplo de email valido: teste-blip@take.net'
    }
  },
  {
    buttonLabel: 'Menu',
    command: {
      id: '1',
      to: '128271320123982@messenger.gw.msging.net',
      type: 'application/vnd.lime.select+json',
      content: {
        text: 'Choose an option',
        options: [
          { text: 'First option' },
          { order: '2', text: 'Second option' },
          {
            order: '3',
            text: 'Third option',
            type: 'application/json',
            value: { key1: 'value1', key2: '2' }
          }
        ]
      }
    }
  },
  {
    buttonLabel: 'QuickReply',
    command: {
      id: '1',
      to: '128271320123982@messenger.gw.msging.net',
      type: 'application/vnd.lime.select+json',
      content: {
        scope: 'immediate',
        text: 'Choose an option',
        options: [
          { text: 'First option' },
          { order: '2', text: 'Second option' },
          {
            order: '3',
            text: 'Third option',
            type: 'application/json',
            value: { key1: 'value1', key2: '2' }
          }
        ]
      }
    }
  },
  {
    buttonLabel: 'Menu Multimídia',
    command: {
      id: '1',
      to: '1042221589186385@messenger.gw.msging.net',
      type: 'application/vnd.lime.document-select+json',
      content: {
        header: {
          type: 'application/vnd.lime.media-link+json',
          value: {
            title: 'Welcome to mad hatter',
            text: 'Here we have the best hats for your head.',
            type: 'image/jpeg',
            uri:
              'http://2.bp.blogspot.com/-pATX0YgNSFs/VP-82AQKcuI/AAAAAAAALSU/Vet9e7Qsjjw/s1600/Cat-hd-wallpapers.jpg',
            aspectRatio: '1:1'
          }
        },
        options: [
          {
            label: {
              type: 'application/vnd.lime.web-link+json',
              value: {
                text: 'Go to our site',
                uri:
                  'http://2.bp.blogspot.com/-pATX0YgNSFs/VP-82AQKcuI/AAAAAAAALSU/Vet9e7Qsjjw/s1600/Cat-hd-wallpapers.jpg'
              }
            }
          },
          {
            label: { type: 'text/plain', value: 'Show stock' },
            value: {
              type: 'application/json',
              value: { action: 'show-items' }
            }
          }
        ]
      }
    }
  },
  {
    buttonLabel: 'Coleção',
    command: {
      id: '1',
      to: '1042221589186385@messenger.gw.msging.net',
      type: 'application/vnd.lime.collection+json',
      content: {
        itemType: 'application/vnd.lime.document-select+json',
        items: [
          {
            header: {
              type: 'application/vnd.lime.media-link+json',
              value: {
                title: 'Title',
                text: 'This is a first item',
                type: 'image/jpeg',
                uri:
                  'http://www.isharearena.com/wp-content/uploads/2012/12/wallpaper-281049.jpg'
              }
            },
            options: [
              {
                label: {
                  type: 'application/vnd.lime.web-link+json',
                  value: {
                    title: 'Link',
                    uri: 'https://server.com/first/link1'
                  }
                }
              },
              {
                label: { type: 'text/plain', value: 'Text 1' },
                value: {
                  type: 'application/json',
                  value: { key1: 'value1', key2: 2 }
                }
              }
            ]
          },
          {
            header: {
              type: 'application/vnd.lime.media-link+json',
              value: {
                title: 'Title 2',
                text: 'This is another item',
                type: 'image/jpeg',
                uri:
                  'http://www.freedigitalphotos.net/images/img/homepage/87357.jpg'
              }
            },
            options: [
              {
                label: {
                  type: 'application/vnd.lime.web-link+json',
                  value: {
                    title: 'Second link',
                    text: 'Weblink',
                    uri: 'https://server.com/second/link2'
                  }
                }
              },
              {
                label: { type: 'text/plain', value: 'Second text' },
                value: {
                  type: 'application/json',
                  value: { key3: 'value3', key4: 4 }
                }
              },
              {
                label: { type: 'text/plain', value: 'More one text' },
                value: {
                  type: 'application/json',
                  value: { key5: 'value5', key6: '6' }
                }
              }
            ]
          }
        ]
      }
    }
  },
  {
    buttonLabel: 'Imagem',
    command: {
      id: '1',
      to: '128271320123982@messenger.gw.msging.net',
      type: 'application/vnd.lime.media-link+json',
      content: {
        type: 'image/jpeg',
        uri:
          'http://2.bp.blogspot.com/-pATX0YgNSFs/VP-82AQKcuI/AAAAAAAALSU/Vet9e7Qsjjw/s1600/Cat-hd-wallpapers.jpg',
        size: '1'
      }
    }
  },
  {
    buttonLabel: 'Sticker',
    command: {
      id: '1',
      to: '128271320123982@messenger.gw.msging.net',
      type: 'application/vnd.lime.media-link+json',
      content: {
        type: 'sticker/webp',
        uri:
          'https://blog.jiayu.co/2019/07/telegram-animated-stickers/sticker.webp'
      }
    }
  },
  {
    buttonLabel: 'Audio',
    command: {
      id: '1',
      to: '128271320123982@messenger.gw.msging.net',
      type: 'application/vnd.lime.media-link+json',
      content: {
        type: 'audio/mp4',
        uri: 'https://files.inqscribe.com/samples/High_Data_IS_Intro.mp4',
        size: '1'
      }
    }
  },
  {
    buttonLabel: 'Video',
    command: {
      id: '1',
      to: '128271320123982@messenger.gw.msging.net',
      type: 'application/vnd.lime.media-link+json',
      content: {
        type: 'video/mp4',
        uri:
          'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
        size: '1'
      }
    }
  },
  {
    buttonLabel: 'WebLink',
    command: {
      id: '1',
      to: '553199991111@0mn.io',
      type: 'application/vnd.lime.web-link+json',
      content: {
        uri: 'http://limeprotocol.org/content-types.html#web-link',
        target: 'self',
        text: 'Segue documentação do web-link'
      }
    }
  },
  {
    buttonLabel: 'Documento',
    command: {
      id: '1',
      to: '128271320123982@messenger.gw.msging.net',
      type: 'application/vnd.lime.media-link+json',
      content: {
        uri:
          'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        title: 'pdf_open_parameters.pdf',
        type: 'application/pdf',
        size: '5540'
      }
    }
  },
  {
    buttonLabel: 'Location',
    command: {
      id: '1',
      to: '1042221589186385@messenger.gw.msging.net',
      type: 'application/vnd.lime.location+json',
      content: {
        latitude: -19.918899,
        longitude: -43.959275,
        altitude: 853,
        text: 'Takes place'
      }
    }
  },
  {
    buttonLabel: 'Pedido de Localização',
    command: {
      id: '1',
      to: '1042221589186385@messenger.gw.msging.net',
      type: 'application/vnd.lime.input+json',
      content: {
        label: { type: 'text/plain', value: 'Send your location please!' },
        validation: {
          rule: 'type',
          type: 'application/vnd.lime.location+json'
        }
      }
    }
  },
  {
    buttonLabel: 'Chatstate',
    command: {
      id: '1',
      to: '104222@telegram.gw.msging.net',
      type: 'application/vnd.lime.chatstate+json',
      content: {
        state: 'composing'
      }
    }
  },
  {
    buttonLabel: 'Ticket',
    command: {
      id: '1',
      to: '104222@telegram.gw.msging.net',
      type: 'application/vnd.iris.ticket+json',
      content: {
        id: '8b337066-b6e9-43a4-b951-3f961e48c127',
        sequentialId: 313,
        sequentialSuffix: 'SFX',
        ownerIdentity: 'testebuilderluiz@msging.net',
        customerIdentity: '4cdbb741-160a-4d77-ba8e-53b54d6225e3.testebuilderluiz@0mn.io',
        customerDomain: '0mn.io',
        provider: 'Lime',
        status: 'Waiting',
        storageDate: '2018-06-28T16:19:09.110Z',
        externalId: '8b337066-b6e9-43a4-b951-3f961e48c127',
        rating: 0,
        team: 'Default',
        unreadMessages: 0,
        closed: false
      }
    }
  },
  {
    buttonLabel: 'Unsupported Content',
    command: {
      id: '1',
      to: '104222@telegram.gw.msging.net',
      type: 'application/vnd.lime.chatstater+json',
      content: {
        state: 'composing'
      }
    }
  },
  {
    buttonLabel: 'Survey',
    command: {
      id: '1',
      to: '104222@telegram.gw.msging.net',
      type: 'application/vnd.lime.satisfaction-survey+json',
      content: {
        type: 'recomendationSurvey',
        scale: 'numeric5',
        question: 'Would you recommend our product? Rate us',
        score: 0
      }
    }
  },
  {
    buttonLabel: 'Contato',
    command: {
      id: '1',
      to: '128271320123982@wa.gw.msging.net',
      type: 'application/vnd.lime.contact+json',
      content: {
        name: 'My Test Contact Name',
        email: 'mycontact@take.net',
        phoneNumber: '+55 33 3131-3131',
        cellPhoneNumber: '+55 33 93131-3131',
        address: 'Contact Address, 1000',
        extras: {
          org: 'Take Blip'
        },
        firstName: 'Contact',
        lastName: 'Last Name'
      }
    }
  },
  {
    buttonLabel: 'Menu List',
    command: {
      id: '1',
      to: '128271320123982@wa.gw.msging.net',
      type: 'application/json',
      content: {
        recipient_type: 'individual',
        type: 'interactive',
        interactive: {
          type: 'list',
          header: {
            type: 'text',
            text: 'E então, com qual assunto posso te ajudar?'
          },
          body: {
            text: 'Clique para abrir as opções 👇'
          },
          action: {
            button: 'Escolher assunto',
            sections: [
              {
                rows: [
                  {
                    id: 'id:1.0',
                    title: '🤖 Como funciona?',
                    description: 'Entender como o Blip funciona, seus benefícios, preços e mais'
                  },
                  {
                    id: 'id:1.1',
                    title: '🤝 Contratar Take Blip',
                    description: 'Quero conversar com o time de vendas para tirar dúvidas e contratar'
                  },
                  {
                    id: 'id:1.2',
                    title: '💬 Já uso o Blip',
                    description: 'Se você é cliente Take Blip e precisa de ajuda ou suporte, clique aqui'
                  },
                  {
                    id: 'id:1.3',
                    title: '👥 Parceria',
                    description: 'Tenho interesse em ser uma empresa parceira'
                  }
                ]
              }
            ]
          }
        }
      }
    }
  },
  {
    buttonLabel: 'Menu List Multi Section',
    command: {
      id: '1',
      to: '128271320123982@wa.gw.msging.net',
      type: 'application/json',
      content: {
        type: 'interactive',
        interactive: {
          type: 'list',
          header: {
            type: 'text',
            text: 'header-content'
          },
          body: {
            text: 'text-body-content'
          },
          footer: {
            text: 'footer-content'
          },
          action: {
            button: 'Choose subject',
            sections: [
              {
                title: 'Section 1',
                rows: [
                  {
                    id: '1',
                    title: '💬 My row 1',
                    description: 'My row 1 description'
                  },
                  {
                    id: '2',
                    title: '🤖 My row 2',
                    description: 'My row 2 description'
                  },
                  {
                    id: '3',
                    title: 'My row 3',
                    description: 'My row 3 description'
                  },
                  {
                    id: '4',
                    title: 'My row 4',
                    description: 'My row 4 description'
                  }
                ]
              },
              {
                title: 'Section 2',
                rows: [
                  {
                    id: '5',
                    title: '💬 My row 5',
                    description: 'My row 5 description'
                  },
                  {
                    id: '6',
                    title: '🤖 My row 6',
                    description: 'My row 6 description'
                  },
                  {
                    id: '7',
                    title: 'My row 7',
                    description: 'My row 7 description'
                  },
                  {
                    id: '8',
                    title: 'My row 8',
                    description: 'My row 8 description'
                  }
                ]
              }
            ]
          }
        }
      }
    }
  },
  {
    buttonLabel: 'Reply Button',
    command: {
      id: '16b0d902-7487-4c5c-b49c-8103558621e7',
      direction: 'sent',
      type: 'application/json',
      content: {
        recipient_type: 'individual',
        type: 'interactive',
        interactive: {
          type: 'button',
          body: {
            text: 'conteúdo de teste'
          },
          action: {
            buttons: [
              {
                type: 'reply',
                reply: {
                  id: '1',
                  title: 'botão 1'
                }
              },
              {
                type: 'reply',
                reply: {
                  id: '2',
                  title: 'botão 2'
                }
              },
              {
                type: 'reply',
                reply: {
                  id: '3',
                  title: 'botão 3'
                }
              }
            ]
          },
          header: {
            type: 'image',
            text: 'take image',
            image: {
              link:
                'https://sindinfor.org.br/wp-content/uploads/2020/10/take-og-image.png'
            }
          },
          footer: {
            text: 'rodapé de testes'
          }
        }
      }
    }
  },
  {
    buttonLabel: 'Reply Message',
    command: {
      id: 'b1c3398f-ef63-426d-98b8-37ca84478f8f',
      to: 'to@msging.net',
      from: 'from@msging.net',
      type: 'application/vnd.lime.reply+json',
      content: {
        replied: {
          type: 'text/plain',
          value: 'replied text'
        },
        inReplyTo: {
          id: 'b1c3398f-ef63-426d-98b8-37ca84478f8f',
          type: 'text/plain',
          value: 'in reply to text'
        }
      }
    }
  },
  {
    buttonLabel: 'Reply Message de Texto com Documento',
    command: {
      id: 'b1c3398f-ef63-426d-98b8-37ca84478f8f',
      to: 'to@msging.net',
      from: 'from@msging.net',
      type: 'application/vnd.lime.reply+json',
      content: {
        replied: {
          type: 'application/vnd.lime.media-link+json',
          value: {
            type: 'application/pdf',
            uri: 'https://blipmediastore.blob.core.windows.net/secure-medias/Media_53990e61-03e2-41e0-ad28-97a2100ee472933743904372393?sv=2019-07-07&st=2023-06-30T21%3A24%3A48Z&se=2023-06-30T21%3A54%3A48Z&sr=b&sp=r&sig=ZXh4OvaM7mGj2%2BrgfPl%2ByLrX4WwV03pvtm0%2BlAplLLI%3D&secure=true',
            title: 'my_pdf.pdf',
            size: '5540'
          }
        },
        inReplyTo: {
          id: 'b1c3398f-ef63-426d-98b8-37ca84478f8f',
          type: 'text/plain',
          value: 'in reply to text'
        }
      }
    }
  },
  {
    buttonLabel: 'Reply Message de Texto com Video',
    command: {
      id: 'b1c3398f-ef63-426d-98b8-37ca84478f8f',
      to: 'to@msging.net',
      from: 'from@msging.net',
      type: 'application/vnd.lime.reply+json',
      content: {
        replied: {
          type: 'application/vnd.lime.media-link+json',
          value: {
            type: 'video/mp4',
            uri: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4'
          }
        },
        inReplyTo: {
          id: 'b1c3398f-ef63-426d-98b8-37ca84478f8f',
          type: 'text/plain',
          value: 'in reply to Video'
        }
      }
    }
  },
  {
    buttonLabel: 'Reply Message de Texto com Audio',
    command: {
      id: 'b1c3398f-ef63-426d-98b8-37ca84478f8f',
      to: 'to@msging.net',
      from: 'from@msging.net',
      type: 'application/vnd.lime.reply+json',
      content: {
        replied: {
          type: 'application/vnd.lime.media-link+json',
          value: {
            type: 'audio/mp4',
            uri: 'https://files.inqscribe.com/samples/High_Data_IS_Intro.mp4'
          }
        },
        inReplyTo: {
          id: 'b1c3398f-ef63-426d-98b8-37ca84478f8f',
          type: 'text/plain',
          value: 'in reply to Audio'
        }
      }
    }
  },
  {
    buttonLabel: 'Reply Message de Texto com Imagem',
    command: {
      id: 'b1c3398f-ef63-426d-98b8-37ca84478f8f',
      to: 'to@msging.net',
      from: 'from@msging.net',
      type: 'application/vnd.lime.reply+json',
      content: {
        replied: {
          type: 'application/vnd.lime.media-link+json',
          value: {
            type: 'image/jpeg',
            uri: 'http://2.bp.blogspot.com/-pATX0YgNSFs/VP-82AQKcuI/AAAAAAAALSU/Vet9e7Qsjjw/s1600/Cat-hd-wallpapers.jpg'
          }
        },
        inReplyTo: {
          id: 'b1c3398f-ef63-426d-98b8-37ca84478f8f',
          type: 'text/plain',
          value: 'in reply to Imagem'
        }
      }
    }
  },
  {
    buttonLabel: 'Reply Message de Menu',
    command: {
      id: 'b1c3398f-ef63-426d-98b8-37ca84478f8f',
      to: 'to@msging.net',
      from: 'from@msging.net',
      type: 'application/vnd.lime.reply+json',
      content: {
        replied: {
          type: 'text/plain',
          value: 'replied text'
        },
        inReplyTo: {
          id: 'b1c3398f-ef63-426d-98b8-37ca84478f8f',
          type: 'application/vnd.lime.select+json',
          value: {
            scope: 'immediate',
            text: 'Choose an option',
            options: [
              { text: 'First option' },
              { order: '2', text: 'Second option' },
              {
                order: '3',
                text: 'Third option',
                type: 'application/json',
                value: { key1: 'value1', key2: '2' }
              }
            ]
          }
        }
      }
    }
  },
  {
    buttonLabel: 'Reply Message de Menu List',
    command: {
      id: 'b1c3398f-ef63-426d-98b8-37ca84478f8f',
      to: 'to@msging.net',
      from: 'from@msging.net',
      type: 'application/vnd.lime.reply+json',
      content: {
        replied: {
          type: 'text/plain',
          value: 'replied text'
        },
        inReplyTo: {
          type: 'application/json',
          value: {
            recipient_type: 'individual',
            type: 'interactive',
            interactive: {
              type: 'list',
              header: {
                type: 'text',
                text: 'E então, com qual assunto posso te ajudar?'
              },
              body: {
                text: 'Clique para abrir as opções 👇'
              },
              action: {
                button: 'Escolher assunto',
                sections: [
                  {
                    rows: [
                      {
                        id: 'id:1.0',
                        title: '🤖 Como funciona?',
                        description: 'Entender como o Blip funciona, seus benefícios, preços e mais'
                      },
                      {
                        id: 'id:1.1',
                        title: '🤝 Contratar Take Blip',
                        description: 'Quero conversar com o time de vendas para tirar dúvidas e contratar'
                      }
                    ]
                  }
                ]
              }
            }
          }
        }
      }
    }
  },
  {
    buttonLabel: 'Reply Message de Menu List Multi Section',
    command: {
      id: 'b1c3398f-ef63-426d-98b8-37ca84478f8f',
      to: 'to@msging.net',
      from: 'from@msging.net',
      type: 'application/vnd.lime.reply+json',
      content: {
        replied: {
          type: 'text/plain',
          value: 'replied text'
        },
        inReplyTo: {
          type: 'application/json',
          value: {
            type: 'interactive',
            interactive: {
              type: 'list',
              header: {
                type: 'text',
                text: 'header-content'
              },
              body: {
                text: 'text-body-content'
              },
              footer: {
                text: 'footer-content'
              },
              action: {
                button: 'Choose subject',
                sections: [
                  {
                    title: 'Section 1',
                    rows: [
                      {
                        id: '1',
                        title: '💬 My row 1',
                        description: 'My row 1 description'
                      }
                    ]
                  },
                  {
                    title: 'Section 2',
                    rows: [
                      {
                        id: '2',
                        title: '💬 My row 2',
                        description: 'My row 2 description'
                      }
                    ]
                  }
                ]
              }
            }
          }
        }
      }
    }
  },
  {
    buttonLabel: 'Reply Message de Reply Buttton',
    command: {
      id: 'b1c3398f-ef63-426d-98b8-37ca84478f8f',
      to: 'to@msging.net',
      from: 'from@msging.net',
      type: 'application/vnd.lime.reply+json',
      content: {
        replied: {
          type: 'text/plain',
          value: 'replied text'
        },
        inReplyTo: {
          type: 'application/json',
          value: {
            recipient_type: 'individual',
            type: 'interactive',
            interactive: {
              type: 'button',
              body: {
                text: 'conteúdo de teste'
              },
              action: {
                buttons: [
                  {
                    type: 'reply',
                    reply: {
                      id: '1',
                      title: 'botão 1'
                    }
                  },
                  {
                    type: 'reply',
                    reply: {
                      id: '2',
                      title: 'botão 2'
                    }
                  }
                ]
              },
              header: {
                type: 'text',
                text: 'header de teste'
              },
              footer: {
                text: 'rodapé de testes'
              }
            }
          }
        }
      }
    }
  },
  {
    buttonLabel: 'Reply Message de Reply Buttton sem header',
    command: {
      id: 'b1c3398f-ef63-426d-98b8-37ca84478f8f',
      to: 'to@msging.net',
      from: 'from@msging.net',
      type: 'application/vnd.lime.reply+json',
      content: {
        replied: {
          type: 'text/plain',
          value: 'replied text'
        },
        inReplyTo: {
          type: 'application/json',
          value: {
            recipient_type: 'individual',
            type: 'interactive',
            interactive: {
              type: 'button',
              body: {
                text: 'conteúdo de teste'
              },
              action: {
                buttons: [
                  {
                    type: 'reply',
                    reply: {
                      id: '1',
                      title: 'botão 1'
                    }
                  },
                  {
                    type: 'reply',
                    reply: {
                      id: '2',
                      title: 'botão 2'
                    }
                  }
                ]
              },
              footer: {
                text: 'rodapé de testes'
              }
            }
          }
        }
      }
    }
  },
  {
    buttonLabel: 'Reaction de texto',
    command: {
      id: 'b1c3398f-ef63-426d-98b8-37ca84478f8f',
      to: 'to@msging.net',
      from: 'from@msging.net',
      type: 'application/vnd.lime.reaction+json',
      content: {
        emoji: {
          values: [128077]
        },
        inReactionTo: {
          id: 'b1c3398f-ef63-426d-98b8-37ca84478f8f',
          type: 'text/plain',
          value: 'teste',
          direction: 'sent'
        }
      }
    }
  },
  {
    buttonLabel: 'Reaction de áudio',
    command: {
      id: 'b1c3398f-ef63-426d-98b8-37ca84478f8f',
      to: 'to@msging.net',
      from: 'from@msging.net',
      type: 'application/vnd.lime.reaction+json',
      content: {
        inReactionTo: {
          type: 'application/vnd.lime.media-link+json',
          value: {
            type: 'audio/mp4',
            uri: 'https://files.inqscribe.com/samples/High_Data_IS_Intro.mp4'
          },
          direction: 'sent'
        },
        emoji: {
          values: [55357, 56397, 55356, 57341]
        }
      }
    }
  },
  {
    buttonLabel: 'Reaction de vídeo',
    command: {
      id: 'b1c3398f-ef63-426d-98b8-37ca84478f8f',
      to: 'to@msging.net',
      from: 'from@msging.net',
      type: 'application/vnd.lime.reaction+json',
      content: {
        inReactionTo: {
          type: 'application/vnd.lime.media-link+json',
          value: {
            type: 'video/mp4',
            uri: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4'
          },
          direction: 'sent'
        },
        emoji: {
          values: [55357, 56397, 55356, 57341]
        }
      }
    }
  },
  {
    buttonLabel: 'Reaction de imagem',
    command: {
      id: 'b1c3398f-ef63-426d-98b8-37ca84478f8f',
      to: 'to@msging.net',
      from: 'from@msging.net',
      type: 'application/vnd.lime.reaction+json',
      content: {
        inReactionTo: {
          type: 'application/vnd.lime.media-link+json',
          value: {
            type: 'image/jpeg',
            uri:
              'http://2.bp.blogspot.com/-pATX0YgNSFs/VP-82AQKcuI/AAAAAAAALSU/Vet9e7Qsjjw/s1600/Cat-hd-wallpapers.jpg',
            title: 'texto de exemplo'
          },
          direction: 'sent'
        },
        emoji: {
          values: [55357, 56397, 55356, 57341]
        }
      }
    }
  },
  {
    buttonLabel: 'Reaction de sticker',
    command: {
      id: 'b1c3398f-ef63-426d-98b8-37ca84478f8f',
      to: 'to@msging.net',
      from: 'from@msging.net',
      type: 'application/vnd.lime.reaction+json',
      content: {
        inReactionTo: {
          type: 'application/vnd.lime.media-link+json',
          value: {
            type: 'sticker/webp',
            uri:
              'https://res.cloudinary.com/demo/image/upload/fl_awebp,q_40/bored_animation.webp'
          },
          direction: 'sent'
        },
        emoji: {
          values: [55357, 56397, 55356, 57341]
        }
      }
    }
  },
  {
    buttonLabel: 'Reaction de arquivo',
    command: {
      id: 'b1c3398f-ef63-426d-98b8-37ca84478f8f',
      to: 'to@msging.net',
      from: 'from@msging.net',
      type: 'application/vnd.lime.reaction+json',
      content: {
        inReactionTo: {
          type: 'application/vnd.lime.media-link+json',
          value: {
            uri:
              'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
            title: 'pdf_open_parameters.pdf',
            type: 'application/pdf',
            size: '5540'
          },
          direction: 'sent'
        },
        emoji: {
          values: [55357, 56397, 55356, 57341]
        }
      }
    }
  },
  {
    buttonLabel: 'Reaction de location',
    command: {
      id: 'b1c3398f-ef63-426d-98b8-37ca84478f8f',
      to: 'to@msging.net',
      from: 'from@msging.net',
      type: 'application/vnd.lime.reaction+json',
      content: {
        inReactionTo: {
          type: 'application/vnd.lime.location+json',
          value: {
            latitude: -19.918899,
            longitude: -43.959275,
            altitude: 853,
            text: 'Takes place'
          },
          direction: 'sent'
        },
        emoji: {
          values: [55357, 56397, 55356, 57341]
        }
      }
    }
  },
  {
    buttonLabel: 'Reaction de web link',
    command: {
      id: 'b1c3398f-ef63-426d-98b8-37ca84478f8f',
      to: 'to@msging.net',
      from: 'from@msging.net',
      type: 'application/vnd.lime.reaction+json',
      content: {
        inReactionTo: {
          type: 'application/vnd.lime.web-link+json',
          value: {
            uri: 'http://limeprotocol.org/content-types.html#web-link',
            target: 'self',
            text: 'Segue documentação do web-link'
          },
          direction: 'sent'
        },
        emoji: {
          values: [55357, 56397, 55356, 57341]
        }
      }
    }
  },
  {
    buttonLabel: 'Remover reação',
    command: {
      id: 'b1c3398f-ef63-426d-98b8-37ca84478f8f',
      to: 'to@msging.net',
      from: 'from@msging.net',
      type: 'application/vnd.lime.reaction+json',
      content: {
        inReactionTo: {
          id: 'b1c3398f-ef63-426d-98b8-37ca84478f8f',
          type: 'text/plain',
          value: 'teste',
          direction: 'sent'
        },
        emoji: undefined
      }
    }
  },
  {
    buttonLabel: 'Reação de conteúdo não suportado',
    command: {
      id: 'b1c3398f-ef63-426d-98b8-37ca84478f8f',
      to: 'to@msging.net',
      from: 'from@msging.net',
      type: 'application/vnd.lime.reaction+json',
      direction: 'sent',
      content: {
        inReactionTo: {
          type: 'application/x+json',
          direction: 'sent'
        },
        emoji: {
          values: [55357, 56397, 55356, 57341]
        }
      }
    }
  },
  {
    buttonLabel: 'Resumo da conversa',
    command: {
      id: 'b1c3398f-ef63-426d-98b8-37ca84478f8f',
      to: 'to@msging.net',
      from: 'from@msging.net',
      type: 'application/vnd.iris.desk.thread-summary+json',
      content: {
        id: '44528dc9-3174-41f1-8188-0189ae0666d2',
        sequentialId: 11,
        ownerIdentity: 'whatsappcloudapi@msging.net',
        customerIdentity: '5531992722620@wa.gw.msging.net',
        team: 'Maria',
        parentSequentialId: 10,
        priority: 6,
        isLoading: false,
        summary: [
          'Cliente entrou em contato e iniciou atendimento pelo bot, selecionando as opções de atendimento e cancelamento.',
          'Inicialmente, a empresa ofereceu um desconto de 10%, mas o cliente não considerou suficiente.',
          'Após nova negociação, chegaram a um acordo de 20% de desconto, com a condição de fidelidade de 6 meses.'
        ]
      }
    }
  },
  {
    buttonLabel: 'Template Message',
    command: {
      id: '1',
      direction: 'sent',
      type: 'application/json',
      content: {
        name: 'test button web site',
        type: 'template-content',
        template: {
          language: {
            policy: 'deterministic',
            code: 'pt_BR'
          },
          name: 'test_button_web_site',
          components: [
            {
              parameters: [
                {
                  image: 'https://upload.wikimedia.org/wikipedia/commons/c/ce/Example_image.png',
                  type: 'image'
                }
              ],
              type: 'header'
            }
          ]
        },
        templateContent: {
          name: 'test_button_web_site',
          language: 'pt_BR',
          components: [
            {
              type: 'BODY',
              text: 'Olá Usuário!\n\nCompre castanha de caju direto da fábrica!\nSomos {{0}} o parceiro que faltava no fornecimento de castanha de caju orgânica de qualidade para o seu negócio.\n\n_Esta podendo falar?_\n\nhttps://url-link.com/p/ifCeg3/p/ifCeg3/p/ifCeg3/p/ifCeg3/p/ifCeg3/p/ifCeg3/p/ifCeg3/p/ifCeg3/p/ifCeg3/p/ifCeg3.mp4'
            }
          ]
        }
      }
    }
  },
  {
    buttonLabel: 'Template Message - Botão Weblink',
    command: {
      id: '1',
      direction: 'sent',
      type: 'application/json',
      content: {
        name: 'test button web site',
        type: 'template-content',
        template: {
          language: {
            policy: 'deterministic',
            code: 'pt_BR'
          },
          name: 'test_button_web_site',
          components: []
        },
        templateContent: {
          name: 'test_button_web_site',
          language: 'pt_BR',
          components: [
            {
              type: 'BODY',
              text: 'Olá Usuário!\n\nCompre castanha de caju direto da fábrica!\nSomos o parceiro que faltava no fornecimento de castanha de caju orgânica de qualidade para o seu negócio.\n\n_Esta podendo falar?_\n\nhttps://url-link.com/p/ifCeg3.mp4'
            },
            {
              type: 'BUTTONS',
              buttons: [
                {
                  type: 'URL',
                  text: 'Saiba mais',
                  url: 'https://blip.ai/'
                }
              ]
            }
          ]
        }
      }
    }
  },
  {
    buttonLabel: 'Template Message - Botão Phone Number',
    command: {
      id: '1',
      direction: 'sent',
      type: 'application/json',
      content: {
        type: 'template-content',
        template: {
          language: {
            policy: 'deterministic',
            code: 'pt_BR'
          },
          name: 'teste_button_phonenumber',
          components: []
        },
        templateContent: {
          name: 'teste_button_phonenumber',
          language: 'pt_BR',
          components: [
            {
              type: 'BODY',
              text: 'Olá Usuário!\n\nCompre castanha de caju direto da fábrica!\nSomos o parceiro que faltava no fornecimento de castanha de caju orgânica de qualidade para o seu negócio.\n\n*Esta podendo falar?*\n\nhttps://url-link.com/p/ifCeg3.mp4'
            },
            {
              type: 'BUTTONS',
              buttons: [
                {
                  type: 'PHONE_NUMBER',
                  text: 'Falar com o vendedor',
                  phoneNnumber: '+5531999998888'
                }
              ]
            }
          ]
        }
      }
    }
  },
  {
    buttonLabel: 'Template Message - Botão Weblink e Botão telefone',
    command: {
      id: '1',
      direction: 'sent',
      type: 'application/json',
      content: {
        type: 'template-content',
        template: {
          language: {
            policy: 'deterministic',
            code: 'pt_BR'
          },
          name: 'teste_button_website_and_phonenumber',
          components: []
        },
        templateContent: {
          name: 'teste_button_website_and_phonenumber',
          language: 'pt_BR',
          components: [
            {
              type: 'BODY',
              text: 'Olá Usuário!\n\nCompre castanha de caju direto da fábrica!\nSomos o parceiro que faltava no fornecimento de castanha de caju orgânica de qualidade para o seu negócio.\n\n*Esta podendo falar?*\n\nhttps://url-link.com/p/ifCeg3.mp4'
            },
            {
              type: 'BUTTONS',
              buttons: [
                {
                  type: 'URL',
                  text: 'Saiba mais',
                  url: 'https://blip.ai/'
                },
                {
                  type: 'PHONE_NUMBER',
                  text: 'Falar com o vendedor',
                  phoneNnumber: '+5531999998888'
                }
              ]
            }
          ]
        }
      }
    }
  },
  {
    buttonLabel: 'Template Message - Botão QuickReply',
    command: {
      id: '1',
      direction: 'sent',
      type: 'application/json',
      content: {
        type: 'template-content',
        template: {
          language: {
            policy: 'deterministic',
            code: 'pt_BR'
          },
          name: 'test_button_quick_reply_copia',
          components: []
        },
        templateContent: {
          name: 'test_button_quick_reply_copia',
          language: 'pt_BR',
          components: [
            {
              type: 'BODY',
              text: 'Olá Usuário!\n\nCompre castanha de caju direto da fábrica!\nSomos o parceiro que faltava no fornecimento de castanha de caju orgânica de qualidade para o seu negócio.\n\n*Esta podendo falar?*\n\nhttps://url-link.com/p/ifCeg3.mp4'
            },
            {
              type: 'BUTTONS',
              buttons: [
                {
                  type: 'QUICK_REPLY',
                  text: 'Sim'
                },
                {
                  type: 'QUICK_REPLY',
                  text: 'Não'
                },
                {
                  type: 'QUICK_REPLY',
                  text: 'Falar agora'
                }
              ]
            }
          ]
        }
      }
    }
  },
  {
    buttonLabel: 'Template Message - Botão com variável',
    command: {
      id: '1',
      direction: 'sent',
      type: 'application/json',
      content: {
        type: 'template-content',
        template: {
          language: {
            policy: 'deterministic',
            code: 'pt_BR'
          },
          name: 'test_button_website_with_variable',
          components: [
            {
              sub_type: 'url',
              index: '0',
              type: 'button',
              parameters: [
                {
                  text: 'teste',
                  type: 'text'
                }
              ]
            }
          ]
        },
        templateContent: {
          name: 'test_button_website_with_variable',
          language: 'pt_BR',
          components: [
            {
              type: 'BODY',
              text: 'Olá! Cosme\\n\\nCompre castanha de caju direto da fábrica!\\nSomos o parceiro que faltava no fornecimento de castanha de caju orgânica de qualidade para o seu negócio.\\n\\nEsta podendo falar?\\n\\nhttps://url-link.com/p/ifCeg3.mp4'
            },
            {
              type: 'BUTTONS',
              buttons: [
                {
                  type: 'URL',
                  text: 'Ir para o site',
                  url: 'https://blip.ai/{{1}}',
                  example: [
                    'desk'
                  ]
                }
              ]
            }
          ]
        }
      }
    }
  },
  {
    buttonLabel: 'Template Message - imagem longa',
    command: {
      id: '1',
      direction: 'sent',
      type: 'application/json',
      content: {
        type: 'template-content',
        template: {
          language: {
            policy: 'deterministic',
            code: 'pt_BR'
          },
          name: 'test_button_website_with_variable',
          components: [
            {
              parameters: [
                {
                  image: {
                    link: 'https://storage.googleapis.com/support-forums-api/attachment/thread-222038152-7286047119988742904.JPG'
                  },
                  type: 'image'
                }
              ],
              type: 'header'
            },
            {
              sub_type: 'url',
              index: '0',
              type: 'button',
              parameters: [
                {
                  text: 'teste',
                  type: 'text'
                }
              ]
            }
          ]
        },
        templateContent: {
          name: 'test_button_website_with_variable',
          language: 'pt_BR',
          components: [
            {
              type: 'BODY',
              text: 'Olá! Cosme\\n\\nCompre castanha de caju direto da fábrica!\\nSomos o parceiro que faltava no fornecimento de castanha de caju orgânica de qualidade para o seu negócio.\\n\\nEsta podendo falar?\\n\\nhttps://url-link.com/p/ifCeg3.mp4'
            },
            {
              type: 'BUTTONS',
              buttons: [
                {
                  type: 'URL',
                  text: 'Ir para o site',
                  url: 'https://blip.ai/{{1}}',
                  example: [
                    'desk'
                  ]
                }
              ]
            }
          ]
        }
      }
    }
  },
  {
    buttonLabel: 'Template Message - imagem GIGANTE',
    command: {
      id: '1',
      direction: 'sent',
      type: 'application/json',
      content: {
        type: 'template-content',
        template: {
          language: {
            policy: 'deterministic',
            code: 'pt_BR'
          },
          name: 'test_button_website_with_variable',
          components: [
            {
              parameters: [
                {
                  image: {
                    link: 'https://www.onvit.com.br/contents/items/1025_1665688522.jpg?v=1666026064'
                  },
                  type: 'image'
                }
              ],
              type: 'header'
            },
            {
              sub_type: 'url',
              index: '0',
              type: 'button',
              parameters: [
                {
                  text: 'teste',
                  type: 'text'
                }
              ]
            }
          ]
        },
        templateContent: {
          name: 'test_button_website_with_variable',
          language: 'pt_BR',
          components: [
            {
              type: 'BODY',
              text: 'Olá! Cosme\\n\\nCompre castanha de caju direto da fábrica!\\nSomos o parceiro que faltava no fornecimento de castanha de caju orgânica de qualidade para o seu negócio.\\n\\nEsta podendo falar?\\n\\nhttps://url-link.com/p/ifCeg3.mp4'
            },
            {
              type: 'BUTTONS',
              buttons: [
                {
                  type: 'URL',
                  text: 'Ir para o site',
                  url: 'https://blip.ai/{{1}}',
                  example: [
                    'desk'
                  ]
                }
              ]
            }
          ]
        }
      }
    }
  },
  {
    buttonLabel: 'Template Message - imagem vazio e botão editável',
    command: {
      id: '1',
      direction: 'sent',
      type: 'application/json',
      content: {
        type: 'template-content',
        template: {
          language: {
            policy: 'deterministic',
            code: 'pt_BR'
          },
          name: 'test_button_website_with_variable',
          components: [
            {
              parameters: [
                {
                  image: {
                  },
                  type: 'image'
                }
              ],
              type: 'header'
            },
            {
              sub_type: 'url',
              index: '0',
              type: 'button',
              parameters: [
                {
                  text: 'teste',
                  type: 'text'
                }
              ]
            }
          ]
        },
        templateContent: {
          name: 'test_button_website_with_variable',
          language: 'pt_BR',
          components: [
            {
              type: 'BODY',
              text: 'Olá! Cosme\\n\\nCompre castanha de caju direto da fábrica!\\nSomos o parceiro que faltava no fornecimento de castanha de caju orgânica de qualidade para o seu negócio.\\n\\nEsta podendo falar?\\n\\nhttps://url-link.com/p/ifCeg3.mp4'
            },
            {
              type: 'BUTTONS',
              buttons: [
                {
                  type: 'URL',
                  text: 'Ir para o site',
                  url: 'https://blip.ai/{{1}}',
                  example: [
                    'desk'
                  ]
                }
              ]
            }
          ]
        }
      }
    }
  },
  {
    buttonLabel: 'Template Message - imagem vazio / com examplo e botão editável',
    command: {
      id: '1',
      direction: 'sent',
      type: 'application/json',
      content: {
        type: 'template-content',
        template: {
          language: {
            policy: 'deterministic',
            code: 'pt_BR'
          },
          name: 'test_button_website_with_variable',
          components: [
            {
              example: {
                header_handle: [
                  'https://upload.wikimedia.org/wikipedia/commons/c/ce/Example_image.png'
                ]
              },
              parameters: [
                {
                  image: {
                  },
                  type: 'image'
                }
              ],
              type: 'header'
            },
            {
              sub_type: 'url',
              index: '0',
              type: 'button',
              parameters: [
                {
                  text: 'teste',
                  type: 'text'
                }
              ]
            }
          ]
        },
        templateContent: {
          name: 'test_button_website_with_variable',
          language: 'pt_BR',
          components: [
            {
              type: 'BODY',
              text: 'Olá! Cosme\\n\\nCompre castanha de caju direto da fábrica!\\nSomos o parceiro que faltava no fornecimento de castanha de caju orgânica de qualidade para o seu negócio.\\n\\nEsta podendo falar?\\n\\nhttps://url-link.com/p/ifCeg3.mp4'
            },
            {
              type: 'BUTTONS',
              buttons: [
                {
                  type: 'URL',
                  text: 'Ir para o site',
                  url: 'https://blip.ai/{{1}}',
                  example: [
                    'desk'
                  ]
                }
              ]
            }
          ]
        }
      }
    }
  },
  {
    buttonLabel: 'Template Message - imagem e botão editável',
    command: {
      id: '1',
      direction: 'sent',
      type: 'application/json',
      content: {
        type: 'template-content',
        template: {
          language: {
            policy: 'deterministic',
            code: 'pt_BR'
          },
          name: 'test_button_website_with_variable',
          components: [
            {
              parameters: [
                {
                  image: {
                    link: 'https://upload.wikimedia.org/wikipedia/commons/c/ce/Example_image.png'
                  },
                  type: 'image'
                }
              ],
              type: 'header'
            },
            {
              sub_type: 'url',
              index: '0',
              type: 'button',
              parameters: [
                {
                  text: 'teste',
                  type: 'text'
                }
              ]
            }
          ]
        },
        templateContent: {
          name: 'test_button_website_with_variable',
          language: 'pt_BR',
          components: [
            {
              type: 'BODY',
              text: 'Olá! Cosme\\n\\nCompre castanha de caju direto da fábrica!\\nSomos o parceiro que faltava no fornecimento de castanha de caju orgânica de qualidade para o seu negócio.\\n\\nEsta podendo falar?\\n\\nhttps://url-link.com/p/ifCeg3.mp4'
            },
            {
              type: 'BUTTONS',
              buttons: [
                {
                  type: 'URL',
                  text: 'Ir para o site',
                  url: 'https://blip.ai/{{1}}',
                  example: [
                    'desk'
                  ]
                }
              ]
            }
          ]
        }
      }
    }
  },
  {
    buttonLabel: 'Template Message - video vazio com exemplo e botão editável',
    command: {
      id: '1',
      direction: 'sent',
      type: 'application/json',
      content: {
        type: 'template-content',
        template: {
          language: {
            policy: 'deterministic',
            code: 'pt_BR'
          },
          name: 'test_button_website_with_variable',
          components: [
            {
              parameters: [
                {
                  video: {
                  },
                  type: 'video/mp4'
                }
              ],
              type: 'header',
              format: 'VIDEO',
              example: {
                header_handle: [
                  'https://scontent.whatsapp.net/v/t61.29466-34/415186706_1118259036204921_4104792501709373004_n.mp4?ccb=1-7&_nc_sid=8b1bef&_nc_ohc=8qg7w2_IGNsQ7kNvgF3gloy&_nc_ht=scontent.whatsapp.net&edm=AH51TzQEAAAA&oh=01_Q5AaIOBNt_miEc8H-gArJ7WiSP8sp3uQcqCUfotr9WbnyABj&oe=6660878F'
                ]
              }
            },
            {
              sub_type: 'url',
              index: '0',
              type: 'button',
              parameters: [
                {
                  text: 'teste',
                  type: 'text'
                }
              ]
            }
          ]
        },
        templateContent: {
          name: 'test_button_website_with_variable',
          language: 'pt_BR',
          components: [
            {
              type: 'BODY',
              text: 'Olá! Cosme\\n\\nCompre castanha de caju direto da fábrica!\\nSomos o parceiro que faltava no fornecimento de castanha de caju orgânica de qualidade para o seu negócio.\\n\\nEsta podendo falar?\\n\\nhttps://url-link.com/p/ifCeg3.mp4'
            },
            {
              type: 'BUTTONS',
              buttons: [
                {
                  type: 'URL',
                  text: 'Ir para o site',
                  url: 'https://blip.ai/{{1}}',
                  example: [
                    'desk'
                  ]
                }
              ]
            }
          ]
        }
      }
    }
  },
  {
    buttonLabel: 'Template Message - video vazio e botão editável',
    command: {
      id: '1',
      direction: 'sent',
      type: 'application/json',
      content: {
        type: 'template-content',
        template: {
          language: {
            policy: 'deterministic',
            code: 'pt_BR'
          },
          name: 'test_button_website_with_variable',
          components: [
            {
              parameters: [
                {
                  video: {
                  },
                  type: 'video/mp4'
                }
              ],
              type: 'header'
            },
            {
              sub_type: 'url',
              index: '0',
              type: 'button',
              parameters: [
                {
                  text: 'teste',
                  type: 'text'
                }
              ]
            }
          ]
        },
        templateContent: {
          name: 'test_button_website_with_variable',
          language: 'pt_BR',
          components: [
            {
              type: 'BODY',
              text: 'Olá! Cosme\\n\\nCompre castanha de caju direto da fábrica!\\nSomos o parceiro que faltava no fornecimento de castanha de caju orgânica de qualidade para o seu negócio.\\n\\nEsta podendo falar?\\n\\nhttps://url-link.com/p/ifCeg3.mp4'
            },
            {
              type: 'BUTTONS',
              buttons: [
                {
                  type: 'URL',
                  text: 'Ir para o site',
                  url: 'https://blip.ai/{{1}}',
                  example: [
                    'desk'
                  ]
                }
              ]
            }
          ]
        }
      }
    }
  },
  {
    buttonLabel: 'Template Message - video e botão editável',
    command: {
      id: '1',
      direction: 'sent',
      type: 'application/json',
      content: {
        type: 'template-content',
        template: {
          language: {
            policy: 'deterministic',
            code: 'pt_BR'
          },
          name: 'test_button_website_with_variable',
          components: [
            {
              parameters: [
                {
                  video: {
                    link: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4'
                  },
                  type: 'video/mp4'
                }
              ],
              type: 'header'
            },
            {
              sub_type: 'url',
              index: '0',
              type: 'button',
              parameters: [
                {
                  text: 'teste',
                  type: 'text'
                }
              ]
            }
          ]
        },
        templateContent: {
          name: 'test_button_website_with_variable',
          language: 'pt_BR',
          components: [
            {
              type: 'BODY',
              text: 'Olá! Cosme\\n\\nCompre castanha de caju direto da fábrica!\\nSomos o parceiro que faltava no fornecimento de castanha de caju orgânica de qualidade para o seu negócio.\\n\\nEsta podendo falar?\\n\\nhttps://url-link.com/p/ifCeg3.mp4'
            },
            {
              type: 'BUTTONS',
              buttons: [
                {
                  type: 'URL',
                  text: 'Ir para o site',
                  url: 'https://blip.ai/{{1}}',
                  example: [
                    'desk'
                  ]
                }
              ]
            }
          ]
        }
      }
    }
  },
  {
    buttonLabel: 'Template Message - audio e botão editável',
    command: {
      id: '1',
      direction: 'sent',
      type: 'application/json',
      content: {
        type: 'template-content',
        template: {
          language: {
            policy: 'deterministic',
            code: 'pt_BR'
          },
          name: 'test_button_website_with_variable',
          components: [
            {
              parameters: [
                {
                  audio: {
                    link: 'https://files.inqscribe.com/samples/High_Data_IS_Intro.mp4'
                  },
                  type: 'audio/mp4',
                  size: '1'
                }
              ],
              type: 'header'
            },
            {
              sub_type: 'url',
              index: '0',
              type: 'button',
              parameters: [
                {
                  text: 'teste',
                  type: 'text'
                }
              ]
            }
          ]
        },
        templateContent: {
          name: 'test_button_website_with_variable',
          language: 'pt_BR',
          components: [
            {
              type: 'BODY',
              text: 'Olá! Cosme\\n\\nCompre castanha de caju direto da fábrica!\\nSomos o parceiro que faltava no fornecimento de castanha de caju orgânica de qualidade para o seu negócio.\\n\\nEsta podendo falar?\\n\\nhttps://url-link.com/p/ifCeg3.mp4'
            },
            {
              type: 'BUTTONS',
              buttons: [
                {
                  type: 'URL',
                  text: 'Ir para o site',
                  url: 'https://blip.ai/{{1}}',
                  example: [
                    'desk'
                  ]
                }
              ]
            }
          ]
        }
      }
    }
  },
  {
    buttonLabel: 'Template Message - documento e botão editável - nome grande',
    command: {
      id: '1',
      direction: 'sent',
      type: 'application/json',
      content: {
        type: 'template-content',
        template: {
          language: {
            policy: 'deterministic',
            code: 'pt_BR'
          },
          name: 'test_button_website_with_variable',
          components: [
            {
              parameters: [
                {
                  document: {
                    filename: 'pdf_open_parameters_long_name_document_need_include_spread_on limited_second_line.pdf',
                    link: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
                  },
                  type: 'document'
                }
              ],
              type: 'header'
            },
            {
              sub_type: 'url',
              index: '0',
              type: 'button',
              parameters: [
                {
                  text: 'teste',
                  type: 'text'
                }
              ]
            }
          ]
        },
        templateContent: {
          name: 'test_button_website_with_variable',
          language: 'pt_BR',
          components: [
            {
              type: 'BODY',
              text: 'Olá! Cosme\\n\\nCompre castanha de caju direto da fábrica!\\nSomos o parceiro que faltava no fornecimento de castanha de caju orgânica de qualidade para o seu negócio.\\n\\nEsta podendo falar?\\n\\nhttps://url-link.com/p/ifCeg3.mp4'
            },
            {
              type: 'BUTTONS',
              buttons: [
                {
                  type: 'URL',
                  text: 'Clique para visualizar o documento',
                  url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
                  example: [
                    'desk'
                  ]
                }
              ]
            }
          ]
        }
      }
    }
  },
  {
    buttonLabel: 'Template Message - documento e botão editável - nome completo',
    command: {
      id: '1',
      direction: 'sent',
      type: 'application/json',
      content: {
        type: 'template-content',
        template: {
          language: {
            policy: 'deterministic',
            code: 'pt_BR'
          },
          name: 'test_button_website_with_variable',
          components: [
            {
              parameters: [
                {
                  document: {
                    filename: 'pdf_open_parameters_complete_name.pdf',
                    link: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
                  },
                  type: 'document'
                }
              ],
              type: 'header'
            },
            {
              sub_type: 'url',
              index: '0',
              type: 'button',
              parameters: [
                {
                  text: 'teste',
                  type: 'text'
                }
              ]
            }
          ]
        },
        templateContent: {
          name: 'test_button_website_with_variable',
          language: 'pt_BR',
          components: [
            {
              type: 'BODY',
              text: 'Olá! Cosme\\n\\nCompre castanha de caju direto da fábrica!\\nSomos o parceiro que faltava no fornecimento de castanha de caju orgânica de qualidade para o seu negócio.\\n\\nEsta podendo falar?\\n\\nhttps://url-link.com/p/ifCeg3.mp4'
            },
            {
              type: 'BUTTONS',
              buttons: [
                {
                  type: 'URL',
                  text: 'Clique para visualizar o documento',
                  url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
                  example: [
                    'desk'
                  ]
                }
              ]
            }
          ]
        }
      }
    }
  },
  {
    buttonLabel: 'Template Message - documento vazio e botão editável - nome pequeno',
    command: {
      id: '1',
      direction: 'sent',
      type: 'application/json',
      content: {
        type: 'template-content',
        template: {
          language: {
            policy: 'deterministic',
            code: 'pt_BR'
          },
          name: 'test_button_website_with_variable',
          components: [
            {
              parameters: [
                {
                  document: {},
                  type: 'document'
                }
              ],
              type: 'header'
            },
            {
              sub_type: 'url',
              index: '0',
              type: 'button',
              parameters: [
                {
                  text: 'teste',
                  type: 'text'
                }
              ]
            }
          ]
        },
        templateContent: {
          name: 'test_button_website_with_variable',
          language: 'pt_BR',
          components: [
            {
              type: 'BODY',
              text: 'Olá! Cosme\\n\\nCompre castanha de caju direto da fábrica!\\nSomos o parceiro que faltava no fornecimento de castanha de caju orgânica de qualidade para o seu negócio.\\n\\nEsta podendo falar?\\n\\nhttps://url-link.com/p/ifCeg3.mp4'
            },
            {
              type: 'BUTTONS',
              buttons: [
                {
                  type: 'URL',
                  text: 'Clique para visualizar o documento',
                  url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
                  example: [
                    'desk'
                  ]
                }
              ]
            }
          ]
        }
      }
    }
  },
  {
    buttonLabel: 'Template Message - documento vazio com exemplo e botão editável - nome pequeno',
    command: {
      id: '1',
      direction: 'sent',
      type: 'application/json',
      content: {
        type: 'template-content',
        template: {
          language: {
            policy: 'deterministic',
            code: 'pt_BR'
          },
          name: 'test_button_website_with_variable',
          components: [
            {
              parameters: [
                {
                  document: {},
                  type: 'document'
                }
              ],
              example: {
                header_handle: [
                  'https://scontent.whatsapp.net/v/t61.29466-34/357690658_1023043205501498_318227860433953620_n.pdf?ccb=1-7&_nc_sid=8b1bef&_nc_ohc=UaDwzdYW0TMQ7kNvgEH_wBg&_nc_ht=scontent.whatsapp.net&edm=AH51TzQEAAAA&oh=01_Q5AaIBjwSXFKbFTUryBh1kjVrM-fmG6haTzpT-rz4IB3wEnK&oe=66607EA6'
                ]
              },
              format: 'DOCUMENT',
              type: 'header'
            },
            {
              sub_type: 'url',
              index: '0',
              type: 'button',
              parameters: [
                {
                  text: 'teste',
                  type: 'text'
                }
              ]
            }
          ]
        },
        templateContent: {
          name: 'test_button_website_with_variable',
          language: 'pt_BR',
          components: [
            {
              type: 'BODY',
              text: 'Olá! Cosme\\n\\nCompre castanha de caju direto da fábrica!\\nSomos o parceiro que faltava no fornecimento de castanha de caju orgânica de qualidade para o seu negócio.\\n\\nEsta podendo falar?\\n\\nhttps://url-link.com/p/ifCeg3.mp4'
            },
            {
              type: 'BUTTONS',
              buttons: [
                {
                  type: 'URL',
                  text: 'Clique para visualizar o documento',
                  url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
                  example: [
                    'desk'
                  ]
                }
              ]
            }
          ]
        }
      }
    }
  },
  {
    buttonLabel: 'Template Message - documento e botão editável - nome pequeno',
    command: {
      id: '1',
      direction: 'sent',
      type: 'application/json',
      content: {
        type: 'template-content',
        template: {
          language: {
            policy: 'deterministic',
            code: 'pt_BR'
          },
          name: 'test_button_website_with_variable',
          components: [
            {
              parameters: [
                {
                  document: {
                    filename: 'pdf_open_param.pdf',
                    link: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
                  },
                  type: 'document'
                }
              ],
              type: 'header'
            },
            {
              sub_type: 'url',
              index: '0',
              type: 'button',
              parameters: [
                {
                  text: 'teste',
                  type: 'text'
                }
              ]
            }
          ]
        },
        templateContent: {
          name: 'test_button_website_with_variable',
          language: 'pt_BR',
          components: [
            {
              type: 'BODY',
              text: 'Olá! Cosme\\n\\nCompre castanha de caju direto da fábrica!\\nSomos o parceiro que faltava no fornecimento de castanha de caju orgânica de qualidade para o seu negócio.\\n\\nEsta podendo falar?\\n\\nhttps://url-link.com/p/ifCeg3.mp4'
            },
            {
              type: 'BUTTONS',
              buttons: [
                {
                  type: 'URL',
                  text: 'Clique para visualizar o documento',
                  url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
                  example: [
                    'desk'
                  ]
                }
              ]
            }
          ]
        }
      }
    }
  },
  {
    buttonLabel: 'Template Message - documento e botão link - new',
    command: {
      id: '1',
      direction: 'sent',
      type: 'application/json',
      content: {
        type: 'template-content',
        template: {
          language: {
            policy: 'deterministic',
            code: 'pt_BR'
          },
          name: 'automation_test_document_quick_answers',
          components: [
            {
              type: 'header',
              parameters: [
                {
                  document: {
                    filename: 'dummy',
                    link: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
                  },
                  type: 'document'
                }
              ]
            }
          ]
        },
        templateContent: {
          name: 'automation_test_document_quick_answers',
          language: 'pt_BR',
          components: [
            {
              type: 'HEADER',
              format: 'DOCUMENT',
              example: {
                headerHandle: [
                  'https://scontent.whatsapp.net/v/t61.29466-34/323856102_1904690989867182_4055631374923478479_n.pdf?ccb=1-7&_nc_sid=8b1bef&_nc_ohc=rG4OYiH3XMwAX9wxLyd&_nc_ht=scontent.whatsapp.net&edm=AH51TzQEAAAA&oh=01_AdTrO5r_-WQeHq8urMwF0ofKowEMvwOj8MZ8Ri6m6JkylA&oe=65B6362E'
                ]
              }
            },
            {
              type: 'BODY',
              text: 'Esta mensagem foi gerada por um teste de automação.\\n\\nTake Blip'
            },
            {
              type: 'BUTTONS',
              buttons: [
                {
                  type: 'URL',
                  text: 'Clique para visualizar o documento',
                  url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
                  example: [
                    'desk'
                  ]
                }
              ]
            }
          ]
        }
      }
    }
  }
]
