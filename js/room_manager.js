var rooms = [];
var users = [];

function loadRooms() {
    try {
        window.relay.getAllRooms(function (allRooms) {
            var cr;
            if ($(rooms).not(allRooms).length !== 0 || $(allRooms).not(rooms).length !== 0) { //if array don't contain same elements
                $('#room-list').html("");
                rooms = [];
                window.relay.getCurrentRoom( function (currentRoom) {
                    addRoom(currentRoom);
                    $('#btn_' + currentRoom).addClass('current');
                    rooms.push(currentRoom);
					_(allRooms).each(function (room) {
						if (room !== currentRoom) {
							addRoom(room);
							rooms.push(room);
						}
					});
                    cr = currentRoom;
                });
            }
            getUsers(cr);
        });
    } catch(err) {
        console.log(err);
    }
}

function addRoom(room) {
    $('#room-list').append(
        $('<li>').attr({
        	'class': 'room-btn col-sm-4',
        	'id': 'btn_' + room
        }).append(
            $('<a>').attr('href','#').append(room)
        )
    );
    $('#btn_' + room).click( function() {
        console.log("Switched to " + room);
        relay.switchRoom(room);
        loadRooms();
    });
}

function getUsers(room) {
    window.relay.getAllUsers(function (allUsers) {
        var cu;
        if ($(users).not(allUsers).length !== 0 || $(allUsers).not(users).length !== 0) { //if array don't contain same elements
            $('#room-users').html("");
            users = [];
            window.relay.getUsername(function (currentUser) {
                addUser(currentUser);
                $('#user_' + currentUser).addClass('current');
                users.push(currentUser);
                _(allUsers).each(function (user) {
					if (user !== currentUser) {
						addUser(user);
						users.push(user);
					}
				});
                cu = currentUser;
            });
        }
    });
}

function addUser(user) {
    $('#room-users').append(
        $('<li>').attr({
        	'class': 'user',
        	'id': 'user_' + user
        }).append(
        	$('<a>').html(user)
        )
    );
}

$(document).ready(function () {
    $(window).bind('socketConnected', function(e) {
        console.log('socket connected');
        loadRooms();
        console.log('rooms loaded');
        var refreshCount = setInterval( function() { //reload users every 10 sec
            loadRooms();
        }, 5000);

        $('#room-manager-tab').click( function () {
            console.log('room manager tab clicked');
        	$('#room-manager-menu').slideToggle();
        	$('#room-manager-icon').toggleClass('glyphicon-chevron-down');
        	$('#room-manager-icon').toggleClass('glyphicon-chevron-up');
        });

        $('#roomNameSubmit').click( function () {
            console.log('room name submit');
        	var roomName = $('#roomName').val();
        	if (roomName !== "") {
        		$('#roomName').val("");
        		relay.switchRoom(roomName);
        		loadRooms();
        	}
        });

        $('#userNameSubmit').click( function () {
            console.log('change user name submit');
        	userName = $('#userName').val();
        	if (userName !== "") {
        		$('#userName').val("");
        		relay.setUsername(userName);
        		$('#room-users .current a').html(userName);
        	}
        });

        $(window).keydown(function (event){
            if(event.keyCode === 13) {  //if enter key is clicked
                console.log('enter clicked');
            	event.preventDefault();
            	if ($('#roomName').is(':focus')) {
            		$('#roomNameSubmit').click();
            	} else if ($('#userName').is(':focus')) {
            		$('#userNameSubmit').click();
            	}
            	return false;
            }
        });
    });
});
