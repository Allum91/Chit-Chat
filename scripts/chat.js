// adding new chat documents
// setting up a real-time listener to get new chats
// updating the username
// updating the room

class Chatroom {
  constructor(room, displayname){
    this.room = room;
    this.displayname = displayname;
    this.chats = db.collection('chats');
    this.unsub;
  }
  async addChat(message){
    // format a chat object
    const now = new Date();
    const chat = {
      message: message,
      displayname: this.displayname,
      room: this.room,
      created_at: firebase.firestore.Timestamp.fromDate(now)
    };
    // save the chat document
    const response = await this.chats.add(chat);
    return response;
  }
  getChats(callback){
    this.unsub = this.chats
    .where('room', '==', this.room)
    .orderBy('created_at')
      .onSnapshot(snapshot => {
        snapshot.docChanges().forEach(change => {
          if(change.type === 'added'){
            callback(change.doc.data());
          }
        });
    });
  }
  updateName(displayname){
    this.displayname = displayname;
    localStorage.setItem('displayname', displayname);
  }
  updateRoom(room){
    this.room = room;
    console.log('room updated');
    if(this.unsub){
      this.unsub();
    }
  }
}
