/*
 * On load: getAllRooms, populate room-list
 * On load: getAllUsers, populate user-list
 * On user.join, addUser to user-list
 * On user.leave, removeUser from user-list
 * On user.rename, removeUser for old name, then addUser for new name
 * On room.add, addRoom to room-list
 * On room.remove, removeRoom from room-list
 */

var roomList;
var userList;


function domizeName(name) {
    return name.split(' ').join('_');
}

function populateRoomsList() {
    roomList.html('');

    window.relay.getAllRooms(function (allRooms) {
        _(allRooms).each(function (room) {
            addRoom(room);
        });
    });

    window.relay.getCurrentRoom(function (roomName) {
        var roomBtn = 'btn_' + domizeName(roomName);
        $('#' + roomBtn).addClass('current');
    });
}

function addRoom(room) {
    var roomId = domizeName(room),
        roomBtn = 'btn_' + roomId;

    if (!roomExists(room)) {
        roomList.append(
            $('<li>').attr({
                'class': 'room-btn col-sm-4',
                'id': roomBtn
            }).append(
                $('<a>').attr('href','#').append(room)
            )
        );
        $('#' + roomBtn).click(function () {
            switchRoom(room)
        });
    }
}

function roomExists(room) {
    var roomBtn = 'btn_' + domizeName(room);

    return ($('#' + roomBtn).length)
}

function switchRoom(room) {
    var roomId = domizeName(room),
        roomBtn = 'btn_' + roomId;

    relay.switchRoom(room);
    setTimeout(function () {
        $('#room-list li').removeClass('current');
        $('#' + roomBtn).addClass('current');
    }, 50);

    console.log('Switched to room: ' + room);
    populateUsersList();
}

function removeRoom(room) {
    var roomId = domizeName(room),
        roomBtn = 'btn_' + roomId;

    $('#' + roomBtn).remove();
}

function populateUsersList() {
    userList.html('');

    window.relay.getAllUsers(function (allUsers) {
        window.relay.getUsername(function (myName) {
            var index;
            var userClass = 'user_' + domizeName(myName);

            addUser(myName);
            $('.' + userClass).first().addClass('current');

            index = $.inArray(allUsers, myName);
            allUsers.splice(index, 1);

            _(allUsers).each(function (user) {
                addUser(user);
            });
        });
    });
}

function addUser(userName) {
    var userClass = 'user_' + domizeName(userName);

    userList.append(
        $('<li>').attr({
        	'class': 'user ' + userClass
        }).append(
        	$('<a>').html(userName)
        )
    );
}

function renameMe(newName) {
    var li_el = $('#user-list .current'),
        oldName = li_el.find('a').html(),
        oldUserClass = 'user_' + domizeName(oldName),
        newUserClass = 'user_' + domizeName(newName);

    console.log('changing name from ' + oldName + ' to ' + newName);

    li_el.find('a').html(newName);
    li_el.removeClass(oldUserClass);
    li_el.addClass(newUserClass);
    relay.setUsername(newName);
}

function renameUser(oldName, newName) {
    var oldUserClass = 'user_' + domizeName(oldName),
        newUserClass = 'user_' + domizeName(newName),
        li_el = $('.' + oldUserClass),
        first = li_el.first(),
        el;

    console.log('changing name from ' + oldName + ' to ' + newName);

    if (first.hasClass('current')) {
        el = li_el.get(1);
    } else {
        el = first;
    }

    $(el).find('a').html(newName);
    $(el).removeClass(oldUserClass);
    $(el).addClass(newUserClass);
}

function removeUser(userName) {
    var userClass = 'user_' + domizeName(userName),
        userElList = $('.' + userClass),
        first = userElList.first();

    console.log('removing user with name ' + userName);

    if (first.hasClass('current')) {
        userElList.get(1).remove();
    } else {
        first.remove();
    }
}

$(function () {

    $(window).bind('socketConnected', function(e) {

        roomList = $('#room-list');
        userList = $('#user-list');

        populateRoomsList();
        populateUsersList();

        /* Make the room manager tab slide open and closed. */
        $('#room-manager-tab').click( function () {
        	$('#room-manager-menu').slideToggle();
        	$('#room-manager-icon').toggleClass('glyphicon-chevron-down');
        	$('#room-manager-icon').toggleClass('glyphicon-chevron-up');
        });

        /* Handle new room creation. */
        $('#roomNameSubmit').click(function () {
        	var roomName = $('#roomName').val();
            switchRoom(roomName);
            $('#roomName').val("");
        });

        /* Handle username changing. */
        $('#userNameSubmit').click(function () {
        	var userName = $('#userName').val();
            renameMe(userName);
            $('#userName').val("");
        });

        /* Allow user to submit by pressing the ENTER key. */
        $(window).keydown(function (event){
            if(event.keyCode === 13) {
            	event.preventDefault();
            	if ($('#roomName').is(':focus')) {
            		$('#roomNameSubmit').click();
            	} else if ($('#userName').is(':focus')) {
            		$('#userNameSubmit').click();
            	}
            	return false;
            }
        });

        /* When a new user joins, add to user list. */
        socket.on('user.join', function (user) {
            addUser(user)
        });

        /* When a user leaves, remove from user list. */
        socket.on('user.leave', function (user) {
            removeUser(user)
        });

        /* When a user in the current room is renamed, switch out html. */
        socket.on('user.rename', function (blob) {
            renameUser(blob['old'], blob['new']);
        });

        /* When a new room is created, add it to the room list. */
        socket.on('room.add', function (room) {
            addRoom(room);
        });

        /* When a room is removed, remove it from the room list. */
        socket.on('room.remove', function (room) {
            removeRoom(room);
        });

    }); /* end 'socketConnected' listener */

}); /* end 'document.ready' listener */

