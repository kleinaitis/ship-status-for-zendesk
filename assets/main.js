(function () {
    var client = ZAFClient.init();
    client.invoke('resize', { width: '100%', height: '120px' });

    client.get('ticket.requester.id').then(
        function(data) {
            var user_id = data['ticket.requester.id'];
            requestUserInfo(client, user_id);
        }
    );
    getUPSReturnLabelText(client)

    })();

function requestUserInfo(client, id) {
    var settings = {
        url: '/api/v2/users/' + id + '.json',
        type:'GET',
        dataType: 'json',
    };

    client.request(settings).then(
        function(data) {
            showInfo(data);
        },
        function(response) {
            showError(response);
        }
    );
}
function showInfo(data) {
    var requester_data = {
        'name': data.user.name,
        'status': "[text here]",
        'last_checked': formatDate("[date here]")
    };

    var source = document.getElementById("requester-template").innerHTML;
    var template = Handlebars.compile(source);
    var html = template(requester_data);
    document.getElementById("content").innerHTML = html;
}

function showError(response) {
    var error_data = {
        'status': response.status,
        'statusText': response.statusText
    };

    var source = document.getElementById("error-template").innerHTML;
    var template = Handlebars.compile(source);
    var html = template(error_data);
    document.getElementById("content").innerHTML = html;
}

function formatDate(date) {
    var cdate = new Date(date);
    var options = {
        year: "numeric",
        month: "short",
        day: "numeric"
    };
    date = cdate.toLocaleDateString("en-us", options);
    return date;
}

function getUPSReturnLabelText(client) {
    client.on('ticket.custom_field_{custom_field_id}.changed', function() {
            client.get('ticket.customField:custom_field_{custom_field_id}').then((result) => {
                return result["ticket.customField:custom_field_{custom_field_id}"]
            })
        }
    );
}

