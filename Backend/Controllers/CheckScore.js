const {pool} =require("../config/dbconnect");
const pdf=require("pdf-parse");
const {parseResume}=require("../config/generatescore");
exports.checkscore=async (req, res) =>{
  const {resumepdf,jdpdf}=req.body;
  if(!resumepdf || !jdpdf){
    return res.status(400).json({error: 'Both resumepdf and jdpdf are required.'});
  }
   try {
    const resumebuffer=Buffer.from(resumepdf,'base64');
    const jdbuffer=Buffer.from(jdpdf,'base64');
     const response=await parseResume(resumebuffer.toString(),jdbuffer.toString());
     console.log("Parsed Resume Data:", response);
     return res.status(200).json({success: true, data: response});
   } catch (error) {
         console.error("Error in checkscore endpoint:", error);
         res.status(500).json({ error: 'Internal server error' });
   }

}