const sheetID = "1rZoDIOLeAK-sCEs-zWAds4ztNmSbyPT8TGblWO2U98I";

async function searchGrades(){

    const studentId =
    document.getElementById("studentId")
    .value.trim();

    const results =
    document.getElementById("results");

    results.innerHTML = `
    <div class="not-found">
        جاري البحث...
    </div>
    `;

    try{

        const url =
        `https://docs.google.com/spreadsheets/d/${sheetID}/export?format=xlsx`;

        const response = await fetch(url);

        const data = await response.arrayBuffer();

        const workbook =
        XLSX.read(data,{type:"array"});

        let found = false;

        let html = "";

        workbook.SheetNames.forEach(sheetName=>{

            const sheet = workbook.Sheets[sheetName];

            const rows =
            XLSX.utils.sheet_to_json(sheet);

            rows.forEach(row=>{

                const values =
                Object.values(row)
                .map(v=>String(v).trim());

                if(values.includes(studentId)){

                    found = true;

                    const studentName =
                    row["الاسم"] ||
                    row["اسم المتدرب"] ||
                    "غير معروف";

                    html += `

                    <div class="result-card">

                        <div style="
                        display:flex;
                        justify-content:space-between;
                        align-items:center;
                        margin-bottom:20px;
                        ">

                            <div>
                                <div style="
                                font-size:22px;
                                font-weight:bold;
                                color:#145374;
                                ">
                                    ${studentName}
                                </div>

                                <div style="
                                color:#777;
                                margin-top:5px;
                                ">
                                    الرقم التدريبي :
                                    ${studentId}
                                </div>
                            </div>

                            <div style="
                            width:55px;
                            height:55px;
                            border-radius:50%;
                            background:#eef7fb;
                            display:flex;
                            justify-content:center;
                            align-items:center;
                            font-size:24px;
                            ">
                                👤
                            </div>

                        </div>

                        <div style="
                        background:linear-gradient(
                        135deg,
                        #145374,
                        #19a7ce
                        );
                        color:white;
                        padding:15px;
                        border-radius:14px;
                        margin-bottom:15px;
                        font-size:20px;
                        font-weight:bold;
                        ">
                            📘 ${sheetName}
                        </div>

                        <div style="
                        display:grid;
                        grid-template-columns:
                        repeat(auto-fit,minmax(140px,1fr));
                        gap:15px;
                        ">

                    `;

                    Object.entries(row).forEach(([key,val])=>{

                        if(
                            key !== "الاسم" &&
                            key !== "اسم المتدرب"
                        ){

                            const value =
                            val === "" ||
                            val === null ||
                            val === undefined
                            ? "غير مرصود"
                            : val;

                            html += `
                            <div style="
                            background:#f8f9fb;
                            padding:18px;
                            border-radius:14px;
                            text-align:center;
                            ">

                                <div style="
                                color:#777;
                                margin-bottom:10px;
                                font-size:15px;
                                ">
                                    ${key}
                                </div>

                                <div style="
                                font-size:24px;
                                font-weight:bold;
                                color:#145374;
                                ">
                                    ${value}
                                </div>

                            </div>
                            `;
                        }

                    });

                    html += `
                        </div>
                    </div>
                    `;
                }

            });

        });

        if(found){

            html += `
            <button class="print-btn"
            onclick="window.print()">
                🖨️ طباعة النتائج
            </button>
            `;

            results.innerHTML = html;

        }else{

            results.innerHTML = `
            <div class="not-found">
                ❌ لا توجد نتائج
            </div>
            `;
        }

    }catch(error){

        results.innerHTML = `
        <div class="not-found">
            حدث خطأ أثناء جلب البيانات
        </div>
        `;

        console.log(error);
    }
}
