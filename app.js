
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
  var app = $.sammy('#app',function() {
    this.use('Template');

    this.get("/", function(context) {
      context.app.swap('');
      h = context.render("pages/main.template",{}).appendTo(context.$element());
      $.getScript('./config.js', function() {
          setTimeout(function () {
            console.log('Config');
            let readData = url+"/util/attendance/datatable";
            let readData1 = url+"/util/attendance";
            let uploadData = url+"/util/uploads/attendance";
            const temp = $("#dformat").html();
            var dtable = $("#dtable1").DataTable({
              ajax:readData,
              initComplete: function () {
                  var al = this.api().columns(1);
                  var el = this.api().columns(2);
                  var column = al;
                  var select = $('<select class="form-control"><option value=""></option></select>')
                      .appendTo( $(column.footer()).empty() )
                      .on( 'change', function () {
                          var val = $.fn.dataTable.util.escapeRegex(
                              $(this).val()
                          );

                          column
                              .search( val ? '^'+val+'$' : '', true, false )
                              .draw();
                      } );

                  function onlyUnique(value, index, self) {
                      return self.indexOf(value) === index;
                  }



                  column.data().unique().sort().each( function ( d, j ) {
                    var unique = d.filter( onlyUnique );
                    for (var i = 0; i < unique.length; i++) {
                      select.append( '<option value="'+unique[i]+'">'+unique[i]+'</option>' );
                      $("#name").append( '<option value="'+unique[i]+'">'+unique[i]+'</option>' );
                    }
                  });
                  var column = el;
                  var select = $('<select class="form-control"><option value=""></option></select>')
                      .appendTo( $(column.footer()).empty() )
                      .on( 'change', function () {
                          var val = $.fn.dataTable.util.escapeRegex(
                              $(this).val()
                          );

                          column
                              .search( val ? '^'+val+'$' : '', true, false )
                              .draw();
                      } );
                  const max = 3;


                  function onlyUnique(value, index, self) {
                      return self.indexOf(value) === index;
                  }



                  column.data().unique().sort().each( function ( d, j ) {
                    var unique = d.filter( onlyUnique );
                    for (var i = 0; i < unique.length; i++) {
                      select.append( '<option value="'+unique[i]+'">'+unique[i]+'</option>' );
                    }
                  } );
                }
            });
            // console.log(dtable);
            $("#docChange").on("change", function(event) {
              form = new FormData();
              form.append("doc",$("#docChange")[0].files[0]);
              $.ajax({
                url: uploadData,
                type: "POST",
                data:  form,
                contentType: false,
                cache: false,
                processData:false,
                beforeSend : function()
                {
                  toastr.info("Uploading . . .  ");
                },
                success: function(data)
                {
                  if (data.code == 200) {
                    console.log("Reloading . . .");
                    toastr.success("Data Sudah Terupload ");
                    setTimeout(function () {
                      location.reload();
                    }, 1000);
                  }else {
                    toastr.error("Data Gagal Di Upload");
                  }
                },
                error:function(d){
                  toastr.error("System Error");
                }
              });
            })
            function loadData(url = null) {
              if (url != null) {
                readData1 = url;
              }
              $.get(readData1,function(d){
                if (d.code == 200) {
                  $("#dformat").html(temp);
                  toastr.info("Data Diperbarui");
                  numSpan = $("#colspan_num");
                  collAdd = $("#rowIt");
                  fixedRow = [];
                  console.log(d.data[0]);
                  f = [
                    "<th>IN</th>",
                    "<th>OUT</th>",
                    "<th style='background-color:#ffbe76;color:white'>JK</th>"
                  ];
                  x = 2;
                  for (var i = 0; i < d.data[0].attendance.length; i++) {
                    $("#rowIt").append(f[0]);
                    $("#rowIt").append(f[1]);
                    $("#rowIt").append(f[2]);
                  }
                  setTimeout(function () {
                    for (var i = 0; i < d.data[0].attendance.length; i++) {
                      day = moment(d.data[0].attendance[i].period.year+"-"+d.data[0].attendance[i].period.month+"-"+d.data[0].attendance[i].period.date).format("dddd");
                      // console.log(day);
                      $("#loopCast").append("<th colspan='3' style='text-align:center' >"+d.data[0].attendance[i].period.date+" "+dayConvert(day)+"</th>");
                    }
                  }, 1000);


                  $.each(d.data,function(i,el) {
                    // console.log(el);
                    b = [
                      "<tr>",
                      "<td>"+(i+1)+"</td>",
                      "<td>"+el.name+"</td>",
                      "<td>-</td>",
                      "<td>-</td>",
                      "<td>-</td>",
                    ];
                    $.each(el.attendance, function(index, val) {
                      if (val.start_time != null) {
                        b.push("<td>"+(moment(val.start_time*1000).format("HH:mm:ss"))+"</td>");
                        b.push("<td>"+(moment(val.end_time*1000).format("HH:mm:ss"))+"</td>");
                        b.push("<td style='background-color:#ffbe76;color:white'>"+con(val.work_duration)+"</td>");
                      }else{
                        b.push("<td>-</td>");
                        b.push("<td>-</td>");
                        b.push("<td>-</td>");
                      }

                    });
                    b.push("</tr>");
                    $("#rowData").append(b.join(""))
                  });


                } else {
                  toastr.error("Data Tidak Ditemukan");
                  $("#dformat").html(temp);
                }
              })
            }
            loadData();
            const month = ["-","Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
            let as = new Date();
            years = as.getFullYear();
            for (var i = 1; i <= 12; i++) {
              $("#month").append( '<option value="'+i+'">'+month[i]+'</option>' );
              $("#year").append( '<option value="'+years+'">'+years+'</option>' );
              years--;
            }
            let name = null;
            let m = null;
            let year = null;
            function triggerLoader(name,m,year){
              if ((m != null && year != null) || (name != null)) {


                return true;
              }else {
                return false;
              }
            }
            $("#name").on("change", function(event) {
              if ($(this).val() == "") {
                name = null;
              }
              name = $(this).val();
              if (triggerLoader(name,m,year)) {
                if (name != null && year != null && m != null) {
                  loadData(url+"/util/attendance?name="+name+"&month="+m+"&year="+year);
                }
              }
            });
            $("#month").on("change", function(event) {
              if ($(this).val() == "") {
                m = null;
              }
              m = $(this).val();
              if (triggerLoader(name,m,year)) {
                if (name != null && year != null && m != null) {
                  loadData(url+"/util/attendance?name="+name+"&month="+m+"&year="+year);
                }
              }
            });
            $("#year").on("change", function(event) {
              if ($(this).val() == "") {
                year = null;
              }
              year = $(this).val();
              if (triggerLoader(name,m,year)) {
                if (name != null && year != null && m != null) {
                  loadData(url+"/util/attendance?name="+name+"&month="+m+"&year="+year);
                }
              }
            });
          }, 1000);
      }).fail(function(){
        toastr.error("Warning Config File not found");
      });
    });
    this.get("#/monitor",async function(c){
      c.app.swap('');

      c.render('pages/monitoring.template',{}).appendTo(c.$element());
      setTimeout(async function () {
        $.getScript('./config.js',async function(){
          table_data = $("#table-data");
          emp_data = $("#table-staff");
          let emp = await $.get(url+"/util/ramonit/emp").then();
          if (emp.code == 200) {
            let tempData = [
              "<option selected>- Choose Staff -</option>"
            ];
            $.each(emp.data, function(index, val) {
              tempData.push("<option value='"+val.nik+"'>"+val.name+"");
            });
            emp_data.html(tempData.join(""));
          }else {
              toastr.error("Data Pegawai Tidak Ditemukan");
          }
          const noData = [
              '<tr>',
              '<th colspan="5" class="text-center">No Data</th>',
              '</tr>',
          ];
          table_data.html(noData.join(""));

          $('#table-month').change(function () {

							const cstaff = $('#table-staff').val();
							const cyear = $('#table-year').val();
							const cmonth = $(this).val();
              if (isNaN(parseInt(cstaff))) {
                c.redirect("#/monitor");
                return;
              }
							c.redirect(`#/monitor/${cstaff}/${cyear}/${cmonth}/3`);
						});

						$('#table-year').change(function () {

							const cstaff = $('#table-staff').val();
							const cmonth = $('#table-month').val();
							const cyear = $(this).val();
              if (isNaN(parseInt(cstaff))) {
                c.redirect("#/monitor");
                return;
              }
							c.redirect(`#/monitor/${cstaff}/${cyear}/${cmonth}/3`);
						});

						$('#table-staff').change(function () {

							const cmonth = $('#table-month').val();
							const cyear = $('#table-year').val();
							const cstaff = $(this).val();
              if (isNaN(parseInt(cstaff))) {
                c.redirect("#/monitor");
              }else {
                c.redirect(`#/monitor/${cstaff}/${cyear}/${cmonth}/3`);
              }
						});


        }).fail(function(){
          toastr.error("Config Tidak Ditemukan");
        })
      }, 1000);
    });

    this.get("#/monitor/:nik/:year/:month/:limit",async function(c){
      c.app.swap('');
      await $.getScript('./config.js');
      const monthList = [
        "Januari",
        "Februari",
        "Maret",
        "April",
        "Mei",
        "Juni",
        "Juli",
        "Agustus",
        "September",
        "Oktober",
        "November",
        "Desember",
      ];

      const pNik = c.params.nik;
      const pYear = c.params.year;
      const pMonth = c.params.month;
      const pLimit = c.params.limit;

      params = $.param({
        month:pMonth,
        year:pYear,
        nik:pNik,
        limit:pLimit,
      });

      const mData = await $.get(url+"/util/monitor/read?"+params).then();
      console.log(mData);
      c.render('pages/monitoring.template',{}).appendTo(c.$element());
      setTimeout(async function () {

          table_data = $("#table-data");
          console.log(monthList[(pMonth-1)]);
          emp_data = $("#table-staff");
          $("#table-month").append("<option value='"+(pMonth)+"' selected>"+monthList[(pMonth-1)]+"</option>");
          let entities = $("#table-year").find("option");
          $("#table-year").html("");

          $.each(entities,function(k,v){
              yea = $(v).text().trim("");
              if (yea != pYear) {
                $("#table-year").append("<option>"+yea+"</option>");
              }
          });
          $("#table-year").append("<option selected>"+pYear+"</option>");
          let emp = await $.get(url+"/util/ramonit/emp").then();
          if (emp.code == 200) {
            let tempData = [
              "<option selected>- Choose Staff -</option>"
            ];
            $.each(emp.data, function(index, val) {
              if (val.nik == pNik) {
                tempData.push("<option value='"+val.nik+"' selected>"+val.name+"");
              }else {
                tempData.push("<option value='"+val.nik+"'>"+val.name+"");
              }
            });
            emp_data.html(tempData.join(""));
          }else {
              toastr.error("Data Pegawai Tidak Ditemukan");
          }
          const noData = [
              '<tr>',
              '<th colspan="5" class="text-center">No Data</th>',
              '</tr>',
          ];
          table_data.html(noData.join(""));
          if (mData.code == 200 && mData.data.length > 0) {
            content = [];
            $.each(mData.data, function(index, val) {
              rest = [];
              $.each(val.rest, function(i, v) {
                rest.push("<p>"+v.formatted+"</p><p><b>"+v.formatted_duration+"</b></p><hr>");
              });
              temp = [
                "<tr>",
                "<td>"+val.formatted_date+"</td>",
                "<td>-</td>",
                "<td>"+([
                  "<p>"+val.work_time+"</p>",
                  "<p><b>"+val.work_time_duration+"</b></p>",
                ]).join("")+"</td>",
                "<td>"+rest.join("")+"</td>",
                "<td>"+((val.is_over_rest)?"Yes":"No")+"</td>",
                "</tr>",
              ]
              content.push(temp.join(""));
            });
            table_data.html(content.join(""));
          }
          $('#table-month').change(function () {

							const cstaff = $('#table-staff').val();
							const cyear = $('#table-year').val();
							const cmonth = $(this).val();
              if (isNaN(parseInt(cstaff))) {
                c.redirect("#/monitor");
                return;
              }
							c.redirect(`#/monitor/${cstaff}/${cyear}/${cmonth}/${pLimit}`);
						});

					$('#table-year').change(function () {

						const cstaff = $('#table-staff').val();
						let cmonth = $('#table-month').val();
            if (cmonth <= 0) {
              cmonth = 1;
            }
						const cyear = $(this).val();
            if (isNaN(parseInt(cstaff))) {
              c.redirect("#/monitor");
              return;
            }
						c.redirect(`#/monitor/${cstaff}/${cyear}/${cmonth}/${pLimit}`);
					});

					$('#table-staff').change(function () {

						const cmonth = $('#table-month').val();
						const cyear = $('#table-year').val();
						const cstaff = $(this).val();
            if (isNaN(parseInt(cstaff))) {
              c.redirect("#/monitor");
            }else {
              c.redirect(`#/monitor/${cstaff}/${cyear}/${cmonth}/${pLimit}`);
            }
					});


      }, 1000);
    });


  });
  app.run();
})(jQuery);
