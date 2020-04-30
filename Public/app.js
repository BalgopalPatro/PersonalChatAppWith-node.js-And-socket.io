var socket = io.connect('http://localhost:3000');

document.getElementById('username').onkeyup = function(){
    username = $('#username').val();
    socket.emit('valid_user',$('#username').val());
}

var username;

socket.on('is_Valid_user',(rst)=>{
    console.log(rst);
    // document.getElementById('vuserbtn').disabled = rst ;
    if(rst){
        $('#vuserbtn').prop('disabled',false );
    }else{
        $('#vuserbtn').prop('disabled',true );
    }
})

document.getElementById('vuserbtn').onclick = function(){
    document.getElementById('uform').style.display = 'none' ;
    document.getElementById('pform').style.display = 'block';
}

document.getElementById('pin').onkeyup = function(){
    if( $('pform').val() > 99999 ){
        var p = $('pform').val();
        $('pform').val(p)
    }
}