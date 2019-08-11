// adding a new chat document
// setting up a real-time listner to get new charts
// update the username
// updating the room

class Chatroom {
    constructor(room,username){
        this.room = room;
        this.username = username;
        this.chats = db.collection('chats');
        this.unsub;
    }
    async addChat(message){
        // format a chat object
        const now = new Date();
        const chat = {
            message,
            username: this.username,
            room: this.room,
            created_at: firebase.firestore.Timestamp.fromDate(now)
        };
        // save the chat document
        const response = await this.chats.add(chat);
        return response;
    }
    getChats(callback){
       this.unsub= this.chats
        .where('room','==',this.room)
        .orderBy('created_at')
        .onSnapshot(snapshot =>{
            snapshot.docChanges().forEach(change =>{
                if(change.type === 'added'){
                    //update the  ui
                    callback(change.doc.data());
                }
            });
        });
    }
    //update name
    updateName(username){
        this.username = username;
        localStorage.setItem('username',username);
    }
    updateRoom(room){
        this.room =room;
        console.log('room updated');
        if(this.unsub){
            this.unsub();
        }
    }
}



// setTimeout(() =>{
//    chatroom.updateRoom('gaming');
//    chatroom.updateName('yoshi')
//    chatroom.getChats((data) =>{
//        console.log(data);
//    }); 
//    chatroom.addChat('hello');
// },3000);