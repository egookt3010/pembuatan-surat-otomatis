<!doctype html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Bootstrap demo</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-Zenh87qX5JnK2Jl0vWa8Ck2rdkQ2Bzep5IDxbcnCeuOxjzrPF/et3URy9Bv1WTRi" crossorigin="anonymous">
</head>

<body>

    <div class="container mt-4">
        <div class="card">
            <div class="card-body">
                <table class="table">
                    <thead>
                        <tr>
                            <th scope="col">No</th>
                            <th scope="col">Kode</th>
                            <th scope="col">Nama</th>
                            <th scope="col">Aksi</th>
                        </tr>
                    </thead>
                    <tbody id="data">
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.1/jquery.min.js" integrity="sha512-aVKKRRi/Q/YV+4mjoKBsE4x3H+BkegoM/em46NNlCqNTmUYADjBbeNefNxYV7giUp0VxICtqdrbqU7iVaeZNXA==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.6/dist/umd/popper.min.js" integrity="sha384-oBqDVmMz9ATKxIep9tiCxS/Z9fNfEXiDAYTujMAeBAsjFuCZSmKbSSUnQlmh/jp3" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/js/bootstrap.min.js" integrity="sha384-IDwe1+LCz02ROU9k972gdyvl+AESN10+x7tBKgc9I5HFtuNz0wWnPclzo6p9vxnk" crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/axios/1.1.3/axios.min.js" integrity="sha512-0qU9M9jfqPw6FKkPafM3gy2CBAvUWnYVOfNPDYKVuRTel1PrciTj+a9P3loJB+j0QmN2Y0JYQmkBBS8W+mbezg==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
    <script>
        function run(r) {
            const dataMain = JSON.parse(sessionStorage.getItem("main-data"));

            sessionStorage.setItem("_surat", JSON.stringify(dataMain.find(x => x.id_wizard_template == r)));

            if (sessionStorage.getItem("_surat") != undefined) {
                window.location.href = "editor.php"
            }
        }
        async function readData() {
                const getter = await axios.get("http://localhost/v3/api/wizard/getPapper", {
                    headers: {
                        Authorization: 'Bearer ' + sessionStorage.getItem('_token'),
                    },
                });
                if (getter.status == 200) {
                    const data = getter.data;


                    sessionStorage.setItem("main-data", JSON.stringify(data));

                    var html = ``;
                    data.map((_, i) => {
                        html += `<tr>
                            <th scope="row">${i}</th>
                            <td>${_.kode_surat}</td>
                            <td>${_.name}</td>
                            <td>
                                <button class="btn btn-primary btn-sm" onclick="runEdit('${_.id_wizard_template}')">Edit</button>
                                <button class="btn btn-primary btn-sm" onclick="run('${_.id_wizard_template}')">buat</button>
                            </td>
                        </tr>`;
                    });
                    $("#data").html(html)
                }
            }
            (async function() {

                async function login() {
                    const form_data = new FormData();
                    form_data.append("username", "phoenix")
                    form_data.append("password", "password")
                    const getter = await axios.post("http://localhost/v3/api/auth/login", form_data).catch((error) => {
                        console.log(error)
                    });
                    if (getter) {
                        sessionStorage.setItem("_token", getter?.data?.access_token);
                        if (sessionStorage.getItem("_token")) {
                            readData();
                        }
                    }
                }
                login();
            })();

        function runEdit(r) {
            const dataMain = JSON.parse(sessionStorage.getItem('main-data'));
            sessionStorage.clear();
            localStorage.clear();
            sessionStorage.setItem(
                'dataUpdate',
                JSON.stringify(dataMain.find((x) => x.id_wizard_template === r))
            );

            if (sessionStorage.getItem('dataUpdate') != undefined) {
                sessionStorage.removeItem('main-data');
                window.location.href = '../wizard/index.html';
            }
        }
    </script>

</body>

</html>