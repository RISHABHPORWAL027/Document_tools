export const dir2ConsentTemplateHtml = `
<div class="page">

  <!-- HEADER BOX -->
  <div class="header-box">
    <div class="title">Form DIR-2</div>
    <div class="subtitle">Consent to act as Director of a Company</div>
    <div class="rule">[Pursuant to section 152(5) and rule 8 of Companies (Appointment and Qualification of Directors) Rules, 2014]</div>
  </div>

  <!-- TO -->
  <div class="to-section">
    <div class="label">To</div>
    <div class="company-name">{{companyName}}</div>
  </div>

  <!-- SUBJECT -->
  <div class="subject">
    <span class="label">Subject:</span> Consent to act as Director.
  </div>

  <!-- CONSENT PARAGRAPH -->
  <div class="consent-para">
    I, <span class="highlight">{{directorName}}</span>, hereby give my consent to act as Director of <span class="highlight">{{companyName}}</span> (Company under Incorporation), pursuant to sub-section (5) of section 152 of the Companies Act, 2013 and certify that I am not disqualified to become a director under the Companies Act, 2013.
  </div>

  <!-- DETAILS TABLE -->
  <table class="details-table">
    <tr>
      <td class="col-num">1.</td>
      <td class="col-label">Director Identification Number (DIN):</td>
      <td class="col-value">{{din}}</td>
    </tr>
    <tr>
      <td class="col-num">2.</td>
      <td class="col-label">Name (in full):</td>
      <td class="col-value">{{directorName}}</td>
    </tr>
    <tr>
      <td class="col-num">3.</td>
      <td class="col-label">Father's Name (in full):</td>
      <td class="col-value">{{fatherName}}</td>
    </tr>
    <tr>
      <td class="col-num">4.</td>
      <td class="col-label">Address:</td>
      <td class="col-value">{{address}}</td>
    </tr>
    <tr>
      <td class="col-num">5.</td>
      <td class="col-label">E-mail id:</td>
      <td class="col-value">{{email}}</td>
    </tr>
    <tr>
      <td class="col-num">6.</td>
      <td class="col-label">Mobile no.:</td>
      <td class="col-value">{{mobileNumber}}</td>
    </tr>
    <tr>
      <td class="col-num">7.</td>
      <td class="col-label">Income-tax PAN:</td>
      <td class="col-value">{{pan}}</td>
    </tr>
    <tr>
      <td class="col-num">8.</td>
      <td class="col-label">Occupation:</td>
      <td class="col-value">{{occupation}}</td>
    </tr>
    <tr>
      <td class="col-num">9.</td>
      <td class="col-label">Date of birth:</td>
      <td class="col-value">{{formatDate dateOfBirth}}</td>
    </tr>
    <tr>
      <td class="col-num">10.</td>
      <td class="col-label">Nationality:</td>
      <td class="col-value">{{nationality}}</td>
    </tr>
    <tr>
      <td class="col-num">11.</td>
      <td class="col-label">No. of companies in which I am already a Director and out of such companies the names of the companies in which I am a Managing Director, Chief Executive Officer, Whole time Director, Secretary, Chief Financial Officer, Manager:</td>
      <td class="col-value">
        {{#if priorDirectorshipDetails}}
        <div class="prior-narrative" style="margin-bottom: 8px;">{{{nl2br priorDirectorshipDetails}}}</div>
        {{/if}}
        <div><strong>{{existingDirectorships}}</strong></div>
        {{#if directorCompanies.length}}
        {{#each directorCompanies}}
        <div class="sub-item">{{inc @index}}. {{companyName}} — {{designation}}</div>
        {{/each}}
        {{/if}}
      </td>
    </tr>
    <tr>
      <td class="col-num">12.</td>
      <td class="col-label">Particulars of membership No. and Certificate of practice No. if the applicant is a member of any professional Institute:</td>
      <td class="col-value">
        {{#if professionalMembership.length}}
        {{#each professionalMembership}}
        <div class="sub-item">{{inc @index}}. {{instituteName}} | Membership No: {{membershipNumber}} | COP No: {{certificateOfPracticeNumber}}</div>
        {{/each}}
        {{else}}
        N/A
        {{/if}}
      </td>
    </tr>
  </table>

  <!-- DECLARATION -->
  <div class="declaration">
    <div class="heading">Declaration</div>
    <p>I declare that I have not been convicted of any offence in connection with the promotion, formation or management of any company or LLP and have not been found guilty of any fraud or misfeasance or of any breach of duty to any company under this Act or any previous company law in the last five years. I further declare that if appointed my total Directorship in all the companies shall not exceed the prescribed number of companies in which a person can be appointed as a Director.</p>
    <p>I am not required to obtain the security clearance from the Ministry of Home Affairs, Government of India under sub-rule (1) of rule 10 before applying for director identification number.</p>
  </div>

  <!-- SIGNATURE -->
  <div class="signature-section">
    <div class="signature-left">
      <div><strong>Date:</strong> {{formatDate date}}</div>
      <div><strong>Place:</strong> {{place}}</div>
    </div>
    <div class="signature-right">
      <div class="line">
        <div><strong>{{directorName}}</strong></div>
        <div>(PAN: {{pan}})</div>
      </div>
    </div>
  </div>

  <!-- ATTACHMENTS -->
  <div class="attachments">
    <div class="heading">Attachments:</div>
    <ol>
      <li>
        Proof of Identity —
        {{#if identityProofName}}
          <strong>File:</strong> {{identityProofName}}
        {{else}}
          {{#if identityProofDetails}}
            {{identityProofDetails}}
          {{else}}
            _______________
          {{/if}}
        {{/if}}
      </li>
      <li>
        Proof of Residence —
        {{#if addressProofName}}
          <strong>File:</strong> {{addressProofName}}
        {{else}}
          {{#if addressProofDetails}}
            {{addressProofDetails}}
          {{else}}
            _______________
          {{/if}}
        {{/if}}
      </li>
    </ol>
  </div>

</div>
`;

export const dir2ConsentCss = `
* { box-sizing: border-box; margin: 0; padding: 0; }
body {
  font-family: "Times New Roman", Times, serif;
  font-size: 12pt;
  line-height: 1.4;
  color: #000;
  padding: 20px;
  background: #fff;
}
.page { max-width: 800px; margin: 0 auto; }

.header-box {
  background: #eaeaea;
  border: 1px solid #999;
  padding: 12px 16px;
  text-align: center;
  margin-bottom: 16px;
}
.header-box .title {
  font-size: 14pt;
  font-weight: bold;
  font-family: Georgia, serif;
}
.header-box .subtitle {
  font-size: 12pt;
  margin-top: 4px;
  font-family: Georgia, serif;
}
.header-box .rule {
  font-size: 10pt;
  font-style: italic;
  margin-top: 4px;
  font-family: Georgia, serif;
}

.to-section { margin-bottom: 12px; }
.to-section .label { font-weight: bold; }
.to-section .company-name { font-weight: bold; }

.subject { margin-bottom: 8px; }
.subject .label { font-weight: bold; }

.consent-para {
  text-align: justify;
  margin-bottom: 16px;
}
.consent-para .highlight { font-weight: bold; }

.details-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 16px;
}
.details-table th,
.details-table td {
  border: 1px solid #000;
  padding: 6px 8px;
  vertical-align: top;
  text-align: left;
}
.details-table .col-num {
  width: 40px;
  text-align: center;
}
.details-table .col-label { width: 55%; }
.details-table .col-value { width: auto; }
.sub-item { margin-left: 12px; margin-top: 4px; }

.declaration { margin-bottom: 16px; }
.declaration .heading {
  font-weight: bold;
  text-decoration: underline;
  margin-bottom: 8px;
}
.declaration p {
  text-align: justify;
  margin-bottom: 8px;
}

.signature-section {
  display: flex;
  justify-content: space-between;
  margin-top: 24px;
  margin-bottom: 20px;
}
.signature-left div { margin-bottom: 4px; }
.signature-right {
  text-align: right;
  min-width: 200px;
}
.signature-right .line {
  border-top: 1px solid #000;
  padding-top: 4px;
  margin-top: 30px;
}

.attachments .heading {
  font-weight: bold;
  margin-bottom: 6px;
}
.attachments ol { margin-left: 20px; }
.attachments li { margin-bottom: 4px; }

@media print {
  body { padding: 0; }
  .page { max-width: none; }
}
`;
