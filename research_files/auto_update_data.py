import os
from datetime import date

qmd_file = "opendata.qmd"
yml_file = "research_files/data.yml"

entries = []
current_date = date.today().isoformat()
in_en = False

with open(qmd_file, "r", encoding="utf-8") as f:
    for line in f:
        if "<!-- date:" in line:
            current_date = line.split("<!-- date:")[1].split("-->")[0].strip()

        if "::: {.lang-en}" in line:
            in_en = True
        elif line.strip() == ":::":
            in_en = False

        if in_en and line.strip().startswith("#### "):
            title = line.replace("#### ", "").strip()
            entries.append({
                "title": title,
                "date": current_date
            })
            # Reset date to today as a fallback for the next chart
            current_date = date.today().isoformat()

# 2. Completely rewrite data.yml (since opendata.qmd is the source of truth)
new_content = ""
for e in entries:
    new_content += f"""- title: "{e['title']}"
  date: "{e['date']}"
  path: "opendata.html"
  label: "Data"

"""

with open(yml_file, "w", encoding="utf-8") as f:
    f.write(new_content)
