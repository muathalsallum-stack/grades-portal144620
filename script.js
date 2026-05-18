const sheetID = "1rZoDIOLeAK-sCEs-zWAds4ztNmSbyPT8TGblWO2U98I";

async function searchGrades(){

    const studentId = document
        .getElementById("studentId")
        .value
        .trim();

    const results = document.getElementById("results");

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

        const workbook = XLSX.read(data,{type:"array"});

        let found = false;

        let html = "";

        workbook.SheetNames.forEach(sheetName=>{

            const sheet = workbook.Sheets[sheetName];

            const rows = XLSX.utils.sheet_to_json(sheet);

            rows.forEach(row=>{

                const values = Object.values(row)
                    .map(v=>String(v).trim());

                if(values.includes(studentId)){

                    found = true;

                    html += `
                    <div class="result-card">

                        <div class="course-title">
                            📘 ${sheetName}
                        </div>
                    `;

                    Object.entries(row).forEach(([key,val])=>{

                        if(val !== ""){

                            html += `
                            <div class="grade-row">

                                <div class="label">
                                    ${key}
                                </div>

                                <div class="value">
                                    ${val}
                                </div>

                            </div>
                            `;
                        }

                    });

                    html += `
                    </div>
                    `;
                }

            });

        });

        if(found){

            html += `
            <button class="print-btn" onclick="window.print()">
                🖨️ طباعة النتائج
            </button>
            `;

            results.innerHTML = html;

        }else{

            results.innerHTML = `
            <div class="not-found">
                ❌ لم يتم العثور على نتائج
            </div>
            `;
        }

    }catch(error){

        results.innerHTML = `
        <div class="not-found">
            حدث خطأ أثناء الاتصال بالشيت
        </div>
        `;

        console.log(error);
    }
}
