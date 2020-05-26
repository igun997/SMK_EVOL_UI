
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
        pg_a = d[i].pg_a;
        pg_b = d[i].pg_b;
        pg_c = d[i].pg_c;
        pg_d = d[i].pg_d;
        pg_e = d[i].pg_e;
        temp = '<div class="card" style="padding:5px 5px 5px"><p>'+d[i].soal+'</p><label class="label-radio item-content"><input type="radio" name="'+name+'" value="A"><div class="item-inner"><div class="item-title">A. '+pg_a+'</div></div></label><label class="label-radio item-content"><input type="radio" name="'+name+'" value="B"><div class="item-inner"><div class="item-title">B. '+pg_b+'</div></div></label><label class="label-radio item-content"><input type="radio" name="'+name+'" value="C"><div class="item-inner"><div class="item-title">C. '+pg_c+'</div></div></label><label class="label-radio item-content"><input type="radio" name="'+name+'" value="D"><div class="item-inner"><div class="item-title">D. '+pg_d+'</div></div></label><label class="label-radio item-content"><input type="radio" name="'+name+'" value="E"><div class="item-inner"><div class="item-title">E. '+pg_e+'</div></div></label></div>';
      }else {
        temp = '<div class="card" style="padding:5px 5px 5px"><p>'+d[i].soal+'</p><textarea name="'+name+'" class="form_textarea" rows="" cols=""></textarea></div>';
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
                      "<form action='' method='post' onsubmit='return false'>",
                      butir(item.soal),
                      "</form>",
                  ];
                  $("#ujiandetail_space").html(form.join(""));
                  $("#ujiandetail_space").show().fadeIn().animate();
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
