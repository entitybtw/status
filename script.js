        function switchLanguage(lang) {
            const translations = {
                "ru": {
                    "title": "статусы",
                    "checking": "проверяем...",
                    "minecraftOffline": "майнкрафт сервер оффлайн",
                    "playersOnline": "игроков онлайн:",
                    "websiteUp": "entitybtw.ru работает!",
                    "websiteDown": "entitybtw.ru не доступен.",
                    "checkError": "ошибка при проверке сервера."
                },
                "en": {
                    "title": "statuses",
                    "checking": "checking...",
                    "minecraftOffline": "minecraft server is offline",
                    "playersOnline": "players online:",
                    "websiteUp": "entitybtw.ru is online!",
                    "websiteDown": "entitybtw.ru is offline.",
                    "checkError": "error checking the server."
                }
            };

            const selectedLanguage = translations[lang];
            if (selectedLanguage) {
                document.getElementById("page-title").innerText = selectedLanguage.title;
                document.getElementById("rest").innerText = selectedLanguage.checking;
                document.getElementById("website-rest").innerText = selectedLanguage.checking;

                $('#rest').data('offlineMessage', selectedLanguage.minecraftOffline);
                $('#rest').data('onlineMessage', selectedLanguage.playersOnline);
                $('#rest').data('checkError', selectedLanguage.checkError);
                $('#website-rest').data('upMessage', selectedLanguage.websiteUp);
                $('#website-rest').data('downMessage', selectedLanguage.websiteDown);

                checkMinecraftStatus();
                checkWebsiteStatus();
            }
        }

        function checkMinecraftStatus() {
            var mcUrl = "https://api.minetools.eu/ping/play.entitybtw.ru/25565"; 

            $.getJSON(mcUrl, function(r) {
                if (r.error) {
                    $('#rest').html($('#rest').data('offlineMessage'));
                    $('#rest').removeClass('up').addClass('down');
                    return false;
                }

                var playersCount = r.players.online || 0;

                $('#rest').html(r.description.replace(/§(.+?)/gi, '') + 
                                '<br><b>' + $('#rest').data('onlineMessage') + '</b> ' + playersCount);
                $('#favicon').attr('src', r.favicon).show();
                $('#rest').removeClass('down').addClass('up');
            }).fail(function() {
                $('#rest').html($('#rest').data('checkError'));
                $('#rest').removeClass('up').addClass('down');
            });
        }

        function checkWebsiteStatus() {
            var websiteUrl = "https://api.allorigins.win/get?url=" + encodeURIComponent("https://entitybtw.ru");

            fetch(websiteUrl)
                .then(response => {
                    if (!response.ok) {
                        throw new Error("site unavailable.");
                    }
                    return response.json();
                })
                .then(data => {
                    if (data && data.contents) {
                        $('#website-rest').html($('#website-rest').data('upMessage'));
                        $('#website-rest').removeClass('down').addClass('up');
                    } else {
                        throw new Error("site responded incorrectly.");
                    }
                })
                .catch(() => {
                    $('#website-rest').html($('#website-rest').data('downMessage'));
                    $('#website-rest').removeClass('up').addClass('down');
                });
        }

        function updateStatusIndicator() {
            const statuses = [$('#rest'), $('#website-rest')];
            let allOnline = true;

            statuses.forEach(status => {
                if (status.hasClass('down')) {
                    allOnline = false;
                }
            });

            const indicatorCircle = $("#status-indicator");
            
            if (allOnline) {
                indicatorCircle.css("background-color", "green");
                indicatorCircle.show();
            } else {
                indicatorCircle.css("background-color", "red");
            }
        }

        $(document).ready(function () {
            const defaultLang = 'en';
            switchLanguage(defaultLang);
            setTimeout(updateStatusIndicator, 2000);
        });
