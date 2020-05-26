
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
              btn = "<button class='btn btn-primary unduh' data-id='"+btn+"'>Unduh</button>";
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
