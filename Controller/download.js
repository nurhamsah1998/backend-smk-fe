import path from "path";

export const downloadTemplateImportSiswa = async (req, res) => {
  try {
    await res.download(
      path.resolve("./Assets/template/template_import_siswa.xlsx")
    );
  } catch (error) {
    console.log(error);
  }
};
