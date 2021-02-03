(function ($) {
    function setColspan(obj, num = 0) {
        obj.attr("colspan", num);
    }

    function setCol(obj, data = []) {
        obj.html("");
        for (var i = 0; i < data.length; i++) {
            obj.append("<th>" + data[i] + "</th>");
        }
    }

    function dayConvert(day) {
        if (day == "Sunday") {
            return "Minggu";
        } else if (day == "Monday") {
            return "Senin";
        } else if (day == "Tuesday") {
            return "Selasa";
        } else if (day == "Wednesday") {
            return "Rabu";
        } else if (day == "Thursday") {
            return "Kamis";
        } else if (day == "Friday") {
            return "Jumat";
        } else if (day == "Saturday") {
            return "Sabtu";
        } else {
            return "Not Found";
        }
    }

    function con(timestamp) {

        var hours = Math.floor(timestamp / 60 / 60);
        var minutes = Math.floor(timestamp / 60) - (hours * 60);
        var seconds = timestamp % 60;
        var formatted = hours.toString().padStart(2, '0') + ':' + minutes.toString().padStart(2, '0') + ':' + seconds.toString().padStart(2, '0');
        return formatted;
    }

    function isLogin() {
        let status = localStorage.getItem("is_login");
        return status;
    }

    function setMenu(link, name, icon) {
        let boiler = [
            '<li class="nav-item">',
            '<a href="' + link + '" class="nav-link">',
            '<i class="nav-icon fa ' + icon + '"></i>',
            '<p>',
            name,
            '</p>',
            '</a>',
            '</li>'
        ];
        return boiler;
    }

    function butir(d) {
        html = [];
        for (var i = 0; i < d.length; i++) {
            let name = 'jawaban[' + d[i].id + ']';
            if (d[i].tipe === "pg") {
                pg_a = "<div class='text ml-3'>" + d[i].pg_a + "</div>";
                pg_b = "<div class='text ml-3'>" + d[i].pg_b + "</div>";
                pg_c = "<div class='text ml-3'>" + d[i].pg_c + "</div>";
                pg_d = "<div class='text ml-3'>" + d[i].pg_d + "</div>";
                pg_e = "<div class='text ml-3'>" + d[i].pg_e + "</div>";
                temp = '<div class="card m-2"><div class="m-4">'+(i+1)+". "+ d[i].soal + '</div></div>';
                let abc = [];
                console.log(d[i]);
                if(d[i].pg_d === null && d[i].pg_e === null){
                    abc = [
                        '<div class="funkyradio-primary">',
                        '<input  type="radio" id="a' + d[i].id + '" value="A" name="' + name + '">',
                        '<label for="a' + d[i].id + '">' + pg_a + '</label>',
                        '</div>',
                        '<div class="funkyradio-primary">',
                        '<input id="b' + d[i].id + '" type="radio" value="B" name="' + name + '">',
                        '<label for="b' + d[i].id + '">' + pg_b + '</label>',
                        '</div>',
                        '<div class="funkyradio-primary">',
                        '<input id="c' + d[i].id + '" type="radio" value="C" name="' + name + '">',
                        '<label  for="c' + d[i].id + '">' + pg_c + '</label>',
                        '</div>',
                        '<input type="radio" name="'+name+'" value="X" hidden checked>',
                        '</div>',
                    ];
                }else {
                    abc = [
                        '<div class="funkyradio-primary">',
                        '<input  type="radio" id="a' + d[i].id + '" value="A" name="' + name + '">',
                        '<label for="a' + d[i].id + '">' + pg_a + '</label>',
                        '</div>',
                        '<div class="funkyradio-primary">',
                        '<input id="b' + d[i].id + '" type="radio" value="B" name="' + name + '">',
                        '<label for="b' + d[i].id + '">' + pg_b + '</label>',
                        '</div>',
                        '<div class="funkyradio-primary">',
                        '<input id="c' + d[i].id + '" type="radio" value="C" name="' + name + '">',
                        '<label  for="c' + d[i].id + '">' + pg_c + '</label>',
                        '</div>',
                        '<div class="funkyradio-primary">',
                        '<input id="d' + d[i].id + '" type="radio" value="D" name="' + name + '">',
                        '<label for="d' + d[i].id + '">  ' + pg_d + '</label>',
                        '</div>',
                        '<div class="funkyradio-primary">',
                        '<input id="e' + d[i].id + '" type="radio" value="E" name="' + name + '">',
                        '<label  for="e' + d[i].id + '"> ' + pg_e + '</label>',
                        '<input type="radio" name="'+name+'" value="X" hidden checked>',
                        '</div>',
                    ];
                }
                console.log(abc);
                temp += '<div class="card m-2"><div class="m-4">' + abc.join("") + '</div></div>';
                build = [
                    "<div class='row'>",
                    "<div class='col-md-12 funkyradio'>",
                    temp,
                    "<hr>",
                    "</div>",
                    "</div>",
                ];
                temp = build.join("");
            } else {
                temp = '<div class="card m-2"><div class="m-4">' + d[i].soal + '</div></div>';
                temp += '<div class="card m-2"><div class="m-4"><textarea class="form-control" rows="4" name="' + name + '" placeholder="Isikan Jawaban Kamu"></textarea></div></div>';
                build = [
                    "<div class='row'>",
                    "<div class='col-md-12'>",
                    temp,
                    "<hr>",
                    "</div>",
                    "</div>",
                ];
                temp = build.join("");
            }
            html.push(temp);
        }
        return html.join("");
    }

    const loginMenus = [
        {
            "name": "Beranda",
            "link": "#/",
            "icon": "fa-home"
        },
        {
            "name": "Kelas Virtual",
            "link": "#/kelas",
            "icon": "fa-dice-six"
        },
        {
            "name": "Ujian",
            "link": "#/ujian",
            "icon": "fa-table"
        },
        {
            "name": "Logout",
            "link": "#/logout",
            "icon": "fa-sign-out-alt"
        }
    ];

    const logoutMenus = [
        {
            "name": "Beranda",
            "link": "#/",
            "icon": "fa-home"
        }, {
            "name": "Login",
            "link": "#/login",
            "icon": "fa-sign-in-alt"
        },
    ];
    function displayInfo() {
        const info = JSON.parse(localStorage.getItem("info"));
        $("#myname").html(info.nama+" - "+info.nis);
    }
    function menuRoll() {
        $("#list_menus").html("");
        if (isLogin() == 1) {
            loginMenus.forEach((i, key) => {
                const menu = setMenu(i.link, i.name, i.icon);
                $("#list_menus").append(menu.join(""));
            });
            displayInfo();
        } else {
            logoutMenus.forEach((i, key) => {
                const menu = setMenu(i.link, i.name, i.icon);
                $("#list_menus").append(menu.join(""));
            });
        }
    }

    // localStorage.clear();
    // localStorage.setItem("is_login",0);
    var app = $.sammy('#app', function () {
        this.use('Template');

        this.get("/", function (context) {
            context.app.swap('');
            h = context.render("pages/main.html", {}).appendTo(context.$element());
            $.getScript('./config.js', function () {
                setTimeout(function () {
                    menuRoll();

                }, 1000);
            }).fail(function () {
                toastr.error("Warning Config File not found");
            });
        });

        this.get("/#/logout", function (context) {
            context.app.swap('');
            h = context.render("pages/main.html", {}).appendTo(context.$element());
            $.getScript('./config.js', function () {
                setTimeout(function () {
                    localStorage.clear();
                    localStorage.setItem("is_login", 0);
                    menuRoll();

                }, 1000);
            }).fail(function () {
                toastr.error("Warning Config File not found");
            });
        });
        this.post("/#/callback", function (context) {
            console.log("This Post");
            let qs = $.param(JSON.parse(localStorage.getItem("info")));
            pathing = url + "api/jawaban?" + qs;
            console.log(pathing)
            let dform = JSON.stringify(context.params);
            dform = JSON.parse(dform);
            $.ajax({
                url: pathing,
                method: "POST",
                data: dform,
                dataType: "JSON",
                success: function (r) {
                    if (r.status == 1) {
                        toastr.success("Sukses Simpan Ujian, Anda Akan di alihkan");
                        setTimeout(function () {
                            location.href = "#/ujian";
                        }, 1000);
                    } else {
                        toastr.error("Gagal Simpan Ujian");
                    }
                },
                error: function () {
                    toastr.error("Anda Terputus Dari Server");
                }
            });
        });

        this.get("/#/ujian/:id", function (context) {
            context.app.swap('');
            h = context.render("pages/ujian_detail.html", {}).appendTo(context.$element());
            $.getScript('./config.js', function () {
                setTimeout(function () {
                    menuRoll();
                    const id_ujian = context.params.id;
                    let us = JSON.parse(localStorage.getItem("info"));
                    let qs = $.param(JSON.parse(localStorage.getItem("info")));
                    let check = localStorage.getItem("soal");
                    if (check === undefined || check === null) {
                        localStorage.setItem("soal", JSON.stringify([]));

                    }
                    check = JSON.parse(localStorage.getItem("soal"));
                    toastr.info("Data Disiapkan . . .");
                    $("#ujiandetail_pin").find("button[type=submit]").attr("disabled", true);
                    $.get(url + "api/listsoal/" + id_ujian + "?" + qs, function (r) {
                        check[id_ujian] = r.data[id_ujian];
                        localStorage.setItem("soal", JSON.stringify(check));
                        toastr.success("Data Telah Siap");
                        $("#ujiandetail_pin").find("button[type=submit]").attr("disabled", false);
                    });
                    setTimeout(function () {
                        const item = (JSON.parse(localStorage.getItem("soal")))[id_ujian];
                        $("#ujiandetail_pin").on("submit", function () {
                            const own = parseInt($(this).find("input[name=pin]").val());
                            const pin = item.pin;
                            const end = new Date(item.ditutup).getTime();
                            const start = new Date(item.buka).getTime();
                            const now = new Date().getTime();
                            console.log(now >= start);
                            if (now >= start && now < end) {
                                if (own == pin) {
                                    toastr.success("PIN Benar , Tunggu Anda Akan di Alihkan");
                                    setTimeout(function () {

                                        $("#pin_accord").hide().fadeOut().animate();

                                        pathing = url + "api/jawaban";
                                        let form = [
                                            "<form action='/#/callback' class='col-12' id='ujiandetail_savepoint' method='post' onsubmit='return false'>",
                                            butir(item.soal),
                                            "<div class='col-md-12'>",
                                            "<input hidden name='ujian_id' value='" + id_ujian + "'>",
                                            "<input hidden name='nis_siswa' value='" + us.nis + "'>",
                                            "<button class='btn btn-large btn-success btn-flat btn-block'>SIMPAN</button>",
                                            "</div>",
                                            "</form>",
                                        ];
                                        let btn = [
                                            "<div class='row'>",
                                            form.join(""),
                                            "</div>"
                                        ]
                                        $("#ujiandetail_space").html(btn.join(""));
                                        $("#ujiandetail_space").show().fadeIn().animate();
                                        let fiveSeconds = new Date(end).getTime();
                                        $('#clock').countdown(fiveSeconds, {elapse: true}).on('update.countdown', function (event) {
                                            var $this = $(this);
                                            if (!event.elapsed) {
                                                $this.html(event.strftime('Batas Pengerjaan : <span>%H:%M:%S</span>'));
                                            } else {
                                                $('#clock').countdown("stop");
                                                $("#ujiandetail_savepoint").trigger("submit");

                                            }
                                        });

                                    }, 500);
                                } else {
                                    toastr.warning("Maaf PIN Salah");
                                }
                            } else {
                                toastr.error("Waktu Pengerjaan Soal Telah Terlampaui Atau Belum Di Buka");
                            }
                        });
                    }, 1000)

                }, 1000);
            }).fail(function () {
                toastr.error("Warning Config File not found");
            });
        });
        this.get("/#/kelas", function (context) {
            context.app.swap('');
            h = context.render("pages/kelas.html", {}).appendTo(context.$element());
            $.getScript('./config.js', function () {
                setTimeout(function () {
                    const table = $("#kelas_konten");
                    const info = JSON.parse(localStorage.getItem("info"));
                    console.log(info)
                    const reload = ()=>{
                        fetch(url+"/api/vclass/"+info.nis+"?nis="+info.nis+"&password="+info.password+"").then(async r=> {

                            const kelas = await r.json();
                            if (kelas.data.length > 0) {
                                table.html("");
                            }

                            kelas.data.forEach((i, k) => {
                                let btn = [
                                    "<button data-id='"+i.id+"' class='btn btn-primary btn-flat m-1 link_jitsi' type='button'><li class='fa fa-handshake'></li></button>",
                                ];
                                btn.push(
                                    "<a href='"+i.downloadable+"' class='btn btn-success btn-flat m-1' >Materi</a>"
                                );
                                if(i.present_status_id !== null){
                                    if (i.present_status_id == 4){
                                        btn.push(
                                            "<button data-id='"+i.id+"' data-status='1' class='btn btn-danger btn-flat m-1 present' type='button'>Hadir</button>"
                                        );
                                        btn.push(
                                            "<button data-id='"+i.id+"' data-status='2' class='btn btn-danger btn-flat m-1 present' type='button'>Ijin</button>"
                                        );
                                        btn.push(
                                            "<button data-id='"+i.id+"' data-status='3' class='btn btn-danger btn-flat m-1 present' type='button'>Sakit</button>"
                                        );
                                    }



                                }
                                table.append(([
                                    "<tr>",
                                    "<td>" + (k+1) + "</td>",
                                    "<td>" + i.name + "</td>",
                                    "<td>" + i.start_date + "</td>",
                                    "<td>" + i.end_date + "</td>",
                                    "<td>" + i.status_text + "</td>",
                                    "<td>"+btn.join("")+"</td>",
                                    "</tr>",
                                ]).join(""));
                            });
                            table.find(".present").on("click",async function (){
                                let id = $(this).data("id");
                                let status = $(this).data("status");
                                let pin =  prompt("Masukan PIN Presensi Kamu ");
                                if(pin){
                                    let path = url+"api/vclass_present/?nis="+info.nis+"&password="+info.password+"&id="+id+"&status="+status+"&pin="+pin;
                                    fetch(path,{method:"POST",headers:{"Accept":"application/json"},body:JSON.stringify({pin:pin})}).then(async r=> {
                                        const {status,data} = await r.json();
                                        console.log("Status = ",status);
                                        console.log("Status = ",data);
                                        if (status == 1){
                                            toastr.info("Data Presensi Telah Di Simpan");
                                            $("#kelas_reload").trigger("click");
                                        }else{
                                            toastr.error("PIN Presensi Salah");
                                        }

                                    });
                                }
                            })
                            table.find(".link_jitsi").on("click",async function () {
                                let id = $(this).data("id");
                                let path = url + "api/vclass_detail/" + id + "?nis=" + info.nis + "&nis_siswa=" + info.nis + "&password=" + info.password;
                                console.log(path)
                                fetch(path,{method:"GET",headers:{"Accept":"application/json"}}).then(async r=> {
                                    let data = await r.json();
                                    if(data.status == 1){
                                        window.open(
                                            data.link+"#userInfo.displayName="+info.nama,
                                            "_blank"
                                        )
                                        $("#kelas_reload").trigger("click");
                                    }
                                });
                            });

                        })
                    }
                    $("#kelas_reload").on("click",function (){
                        reload();
                    })
                    reload();

                }, 100);
            });
        });
        this.get("/#/ujian", function (context) {
            context.app.swap('');
            h = context.render("pages/ujian.html", {}).appendTo(context.$element());
            $.getScript('./config.js', function () {
                setTimeout(function () {
                    const table = $("#ujian_konten");
                    const info = JSON.parse(localStorage.getItem("info"));
                    $.get(url + "api/listujian/" + info.nis + "?nis=" + info.nis + "&password=" + info.password, function (r) {
                        if (r.data.length > 0) {
                            table.html("");
                        }
                        r.data.forEach((i, k) => {
                            let ids = $(i[5]).data("id");
                            if (i[4] == "Sudah") {

                                btn = "<button class='btn btn-primary m-2' disabled data-id='" + ids + "'>Kerjakan</button><button class='btn btn-primary unduh_jawaban m-2' data-id='" + ids + "'>Unduh Jawaban</button>";
                            } else {
                                btn = "<button class='btn btn-primary unduh'  data-id='" + ids + "'>Kerjakan</button>";

                            }
                            table.append(([
                                "<tr>",
                                "<td>" + i[0] + "</td>",
                                "<td>" + i[1] + "</td>",
                                "<td>" + i[2] + "</td>",
                                "<td>" + i[3] + "</td>",
                                "<td>" + i[4] + "</td>",
                                "<td>" + btn + "</td>",
                                "</tr>",
                            ]).join(""));
                        });

                        table.on("click", ".unduh", function () {
                            console.log("Unduh");
                            toastr.success("Tunggu anda akan di alihkan ");
                            let id = $(this).data("id");
                            setTimeout(function () {
                                console.log(id)
                                location.href = "#/ujian/" + id;
                            }, 1000);
                        })
                        table.on("click", ".unduh_jawaban", function () {
                            console.log("Unduh Jawaban");
                            toastr.success("Tunggu anda akan di alihkan ");
                            let id = $(this).data("id");
                            setTimeout(function () {
                                console.log(id)
                                location.href = url + "api/download_jawaban/" + info.nis + "/nis/"+id+"?nis=" + info.nis + "&password=" + info.password;
                            }, 1000);
                        })
                    });
                    menuRoll();
                    $("#ujian_reload").on("click", function () {
                        toastr.info("Perbarui . . .")
                        $.get(url + "api/listujian/" + info.nis + "?nis=" + info.nis + "&password=" + info.password, function (r) {
                            if (r.data.length > 0) {
                                table.html("");
                            }
                            r.data.forEach((i, k) => {
                                let btn = $(i[5]).data("id");
                                if (i[4] == "Sudah") {

                                    btn = "<button class='btn btn-primary ' disabled data-id='" + btn + "'>Kerjakan</button>";
                                } else {
                                    btn = "<button class='btn btn-primary unduh'  data-id='" + btn + "'>Kerjakan</button>";

                                }
                                table.append(([
                                    "<tr>",
                                    "<td>" + i[0] + "</td>",
                                    "<td>" + i[1] + "</td>",
                                    "<td>" + i[2] + "</td>",
                                    "<td>" + i[3] + "</td>",
                                    "<td>" + i[4] + "</td>",
                                    "<td>" + btn + "</td>",
                                    "</tr>",
                                ]).join(""));
                            });

                            table.on("click", ".unduh", function () {
                                console.log("Unduh");
                                toastr.success("Tunggu anda akan di alihkan ");
                                let id = $(this).data("id");
                                setTimeout(function () {
                                    console.log(id)
                                    location.href = "#/ujian/" + id;
                                }, 1000);
                            })
                        });
                    })

                }, 1000);
            }).fail(function () {
                toastr.error("Warning Config File not found");
            });
        });

        this.get("#/login", function (context) {
            context.app.swap('');
            h = context.render("pages/login.html", {}).appendTo(context.$element());
            $.getScript('./config.js', function () {
                setTimeout(function () {
                    menuRoll();
                    console.log("Menu");
                    $("#login").on("submit", function () {
                        let form = $(this).serialize();
                        $.get(url + "api/login?" + form, function (r) {
                            if (r.status == 1) {
                                toastr.success("Tunggu Kamu Akan Di Alihkan");
                                localStorage.setItem("is_login", 1);
                                localStorage.setItem("info", JSON.stringify(r.data));
                                setTimeout(function () {
                                    location.href = "#/";
                                }, 1000);
                            } else {
                                toastr.error("Username & Password Salah !");
                                $("#login")[0].reset();
                            }
                        }).fail(function (r) {
                            toastr.error("Terputus Dari Server");
                        });
                        console.log(url);
                        console.log(form);
                    })
                }, 1000);
            }).fail(function () {
                toastr.error("Warning Config File not found");
            });
        });
    });
    app.run();
})(jQuery);
