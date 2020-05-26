
(function($){
  function setColspan(obj,num=0) {
    obj.attr("colspan",num);
  }
  function setCol(obj,data=[]) {
    obj.html("");
    for (var i = 0; i < data.length; i++) {
        obj.append("<th>"+data[i]+"</th>");
    }
  }
  function dayConvert(day) {
    if (day == "Sunday") {
      return "Minggu";
    }else if (day == "Monday") {
      return "Senin";
    }else if (day == "Tuesday") {
      return "Selasa";
    }else if (day == "Wednesday") {
      return "Rabu";
    }else if (day == "Thursday") {
      return "Kamis";
    }else if (day == "Friday") {
      return "Jumat";
    }else if (day == "Saturday") {
      return "Sabtu";
    }else{
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
  function isLogin(){
    let status = localStorage.getItem("is_login");
    return status;
  }
  function setMenu(link,name,icon){
    let boiler = [
        '<li class="nav-item">',
        '<a href="'+link+'" class="nav-link">',
        '<i class="nav-icon fa '+icon+'"></i>',
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
      let name = 'jawaban['+d[i].id+']';
      if (d[i].tipe === "pg") {
        pg_a = "<div class='text ml-3'>"+d[i].pg_a+"</div>";
        pg_b = "<div class='text ml-3'>"+d[i].pg_b+"</div>";
        pg_c = "<div class='text ml-3'>"+d[i].pg_c+"</div>";
        pg_d = "<div class='text ml-3'>"+d[i].pg_d+"</div>";
        pg_e = "<div class='text ml-3'>"+d[i].pg_e+"</div>";
        temp = '<div class="card m-2"><div class="m-4">'+d[i].soal+'</div></div>';
        let abc = [
          '<div class="funkyradio-primary">',
          '<input  type="radio" id="a'+d[i].id+'" value="A" name="'+name+'">',
          '<label for="a'+d[i].id+'">'+pg_a+'</label>',
          '</div>',
          '<div class="funkyradio-primary">',
          '<input id="b'+d[i].id+'" type="radio" value="B" name="'+name+'">',
          '<label for="b'+d[i].id+'">'+pg_b+'</label>',
          '</div>',
          '<div class="funkyradio-primary">',
          '<input id="c'+d[i].id+'" type="radio" value="C" name="'+name+'">',
          '<label  for="c'+d[i].id+'">'+pg_c+'</label>',
          '</div>',
          '<div class="funkyradio-primary">',
          '<input id="d'+d[i].id+'" type="radio" value="D" name="'+name+'">',
          '<label for="d'+d[i].id+'">  '+pg_d+'</label>',
          '</div>',
          '<div class="funkyradio-primary">',
          '<input id="e'+d[i].id+'" type="radio" value="E" name="'+name+'">',
          '<label  for="e'+d[i].id+'"> '+pg_e+'</label>',
          '</div>',
        ];
        temp += '<div class="card m-2"><div class="m-4">'+abc.join("")+'</div></div>';
        build = [
            "<div class='row'>",
            "<div class='col-md-12 funkyradio'>",
            temp,
            "</div>",
            "<div class='col-md-12'>",
            "<button class='btn btn-large btn-success btn-flat btn-block'>SIMPAN</button>",
            "</div>",
            "</div>",
        ];
        temp = build.join("");
      }else {
        temp = '<div class="card m-2">'+d[i].soal+'<div>';
      }
      html.push(temp);
    }
    return html.join("");
  }

  const loginMenus = [
    {
      "name":"Beranda",
      "link":"#/",
      "icon":"fa-home"
    },
    {
      "name":"Ujian",
      "link":"#/ujian",
      "icon":"fa-table"
    },
    {
      "name":"Logout",
      "link":"#/logout",
      "icon":"fa-sign-out-alt"
    }
  ];

  const logoutMenus = [
    {
      "name":"Beranda",
      "link":"#/",
      "icon":"fa-home"
    },{
      "name":"Login",
      "link":"#/login",
      "icon":"fa-sign-in-alt"
    },
  ];

  function menuRoll(){
    $("#list_menus").html("");
    if (isLogin() == 1){
      loginMenus.forEach((i,key)=>{
        const menu = setMenu(i.link,i.name,i.icon);
        $("#list_menus").append(menu.join(""));
      });
    }else{
      logoutMenus.forEach((i,key)=>{
        const menu = setMenu(i.link,i.name,i.icon);
        $("#list_menus").append(menu.join(""));
      });
    }
  }

  // localStorage.clear();
  // localStorage.setItem("is_login",0);
  var app = $.sammy('#app',function() {
    this.use('Template');

    this.get("/", function(context) {
      context.app.swap('');
      h = context.render("pages/main.html",{}).appendTo(context.$element());
      $.getScript('./config.js', function() {
          setTimeout(function () {
            menuRoll();

          }, 1000);
      }).fail(function(){
        toastr.error("Warning Config File not found");
      });
    });

    this.get("/#/logout", function(context) {
      context.app.swap('');
      h = context.render("pages/main.html",{}).appendTo(context.$element());
      $.getScript('./config.js', function() {
        setTimeout(function () {
          localStorage.clear();
          localStorage.setItem("is_login",0);
          menuRoll();

        }, 1000);
      }).fail(function(){
        toastr.error("Warning Config File not found");
      });
    });
    this.get("/#/ujian/:id", function(context) {
      context.app.swap('');
      h = context.render("pages/ujian_detail.html",{}).appendTo(context.$element());
      $.getScript('./config.js', function() {
        setTimeout(function () {
          menuRoll();
          const id_ujian = context.params.id;
          let qs = $.param(JSON.parse(localStorage.getItem("info")));
          let check = localStorage.getItem("soal");
          if (check === undefined || check === null){
            localStorage.setItem("soal",JSON.stringify([]));

          }
          check = JSON.parse(localStorage.getItem("soal"));
          toastr.info("Data Disiapkan . . .");
          $("#ujiandetail_pin").find("button[type=submit]").attr("disabled",true);
          $.get(url+"api/listsoal/"+id_ujian+"?"+qs,function (r) {
            check[id_ujian] = r.data[id_ujian];
            localStorage.setItem("soal",JSON.stringify(check));
            toastr.success("Data Telah Siap");
            $("#ujiandetail_pin").find("button[type=submit]").attr("disabled",false);
          });
          setTimeout(function () {
            const item = (JSON.parse(localStorage.getItem("soal")))[id_ujian];
            $("#ujiandetail_pin").on("submit",function () {
              const own = parseInt($(this).find("input[name=pin]").val());
              const pin = item.pin;
              if (own == pin){
                toastr.success("PIN Benar , Tunggu Anda Akan di Alihkan");
                setTimeout(function () {
                  $("#pin_accord").hide().fadeOut().animate();
                  let form = [
                      "<form action='' id='ujiandetail_savepoint' method='post' onsubmit='return false'>",
                      butir(item.soal),
                      "</form>",
                  ];
                  $("#ujiandetail_space").html(form.join(""));
                  $("#ujiandetail_space").show().fadeIn().animate();

                  $("#ujiandetail_savepoint").on("submit",function () {
                    dform = $(this).serializeArray();
                    dform[dform.length] = {name:"ujian_id",value:id_ujian};
                    dform[dform.length] = {name:"nis_siswa",value:(JSON.parse(localStorage.getItem("info"))).nis};
                    console.log(dform);
                    pathing = url+"api/jawaban";
                    console.log(pathing);
                    let c = confirm("Yakin Gak ? ");
                    if (c){
                      c = confirm("Coba Cek Lagi Ada Yang Kelewat Tidak ? ");
                      if (c){
                        $.post(url+"api/jawaban/",dform,function (r) {
                          if (r.status == 1){
                            toastr.error("Sukses Simpan Ujian, Anda Akan di alihkan");
                            setTimeout(function () {
                              location.href="#/ujian";
                            },1000);
                          }else{
                            toastr.error("Gagal Simpan Ujian");
                          }
                        }).fail(function () {
                            toastr.error("Terputus Dari Server");
                        });
                      }
                    }
                  });
                },500);
              }else {
                toastr.warning("Maaf PIN Salah");
              }
            });
          },1000)

        }, 1000);
      }).fail(function(){
        toastr.error("Warning Config File not found");
      });
    });

    this.get("/#/ujian", function(context) {
      context.app.swap('');
      h = context.render("pages/ujian.html",{}).appendTo(context.$element());
      $.getScript('./config.js', function() {
        setTimeout(function () {
          const table = $("#ujian_konten");
          const info = JSON.parse(localStorage.getItem("info"));
          $.get(url+"api/listujian/"+info.nis+"?nis="+info.nis+"&password="+info.password,function (r) {
            if (r.data.length > 0){
              table.html("");
            }
            r.data.forEach((i,k)=>{
              let btn = $(i[5]).data("id");
              btn = "<button class='btn btn-primary unduh' data-id='"+btn+"'>Kerjakan</button>";
              table.append(([
                "<tr>",
                "<td>"+i[0]+"</td>",
                "<td>"+i[1]+"</td>",
                "<td>"+i[2]+"</td>",
                "<td>"+i[3]+"</td>",
                "<td>"+i[4]+"</td>",
                "<td>"+btn+"</td>",
                "</tr>",
              ]).join(""));
            });

            table.on("click",".unduh",function () {
              console.log("Unduh");
              toastr.success("Tunggu anda akan di alihkan ");
              let id = $(this).data("id");
              setTimeout(function () {
                console.log(id)
                location.href="#/ujian/"+id;
              },1000);
            })
          });
          menuRoll();
          $("#ujian_reload").on("click",function () {
            toastr.info("Perbarui . . .")
            $.get(url+"api/listujian/"+info.nis+"?nis="+info.nis+"&password="+info.password,function (r) {
              if (r.data.length > 0){
                table.html("");
              }
              r.data.forEach((i,k)=>{
                let btn = $(i[5]).data("id");
                table.append(([
                  "<tr>",
                  "<td>"+i[0]+"</td>",
                  "<td>"+i[1]+"</td>",
                  "<td>"+i[2]+"</td>",
                  "<td>"+i[3]+"</td>",
                  "<td>"+i[4]+"</td>",
                  "<td>"+btn+"</td>",
                  "</tr>",
                ]).join(""));
              });
            });
          })

        }, 1000);
      }).fail(function(){
        toastr.error("Warning Config File not found");
      });
    });

    this.get("#/login", function(context) {
      context.app.swap('');
      h = context.render("pages/login.html",{}).appendTo(context.$element());
      $.getScript('./config.js', function() {
        setTimeout(function () {
          menuRoll();
          console.log("Menu");
          $("#login").on("submit",function () {
            let form = $(this).serialize();
            $.get(url+"api/login?"+form,function (r) {
              if(r.status == 1){
                toastr.success("Tunggu Kamu Akan Di Alihkan");
                localStorage.setItem("is_login",1);
                localStorage.setItem("info",JSON.stringify(r.data));
                setTimeout(function () {
                  location.href="#/";
                },1000);
              }else{
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
      }).fail(function(){
        toastr.error("Warning Config File not found");
      });
    });


  });
  app.run();
})(jQuery);
