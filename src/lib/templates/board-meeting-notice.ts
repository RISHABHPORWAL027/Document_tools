export const boardMeetingNoticeTemplateHtml = `
<div class="doc">
  <div class="doc__header">
    <div class="doc__title">{{companyName}}</div>
    {{#if cin}}<div class="doc__meta">CIN: {{cin}}</div>{{/if}}
    <div class="doc__meta">{{registeredOfficeAddress}}</div>
  </div>

  <div class="doc__h1">NOTICE OF BOARD MEETING</div>

  <div class="doc__p">
    Notice is hereby given that a meeting of the Board of Directors of
    <strong>{{companyName}}</strong> will be held on <strong>{{formatDate meetingDate}}</strong> at
    <strong>{{meetingTime}}</strong> at <strong>{{meetingVenue}}</strong> to transact the following business:
  </div>

  <div class="doc__h2">Agenda</div>
  <ol class="doc__ol">
    {{#each agendaItems}}
      <li>
        <div><strong>{{title}}</strong></div>
        {{#if details}}<div class="doc__muted">{{details}}</div>{{/if}}
      </li>
    {{/each}}
  </ol>

  <div class="doc__p">You are requested to make it convenient to attend the meeting.</div>

  <div class="doc__sign">
    <div>Date: {{noticeDate}}</div>
    <div>Place: {{meetingVenue}}</div>
    <div class="doc__signBlock">
      <div>For {{companyName}}</div>
      <div class="doc__spacer"></div>
      <div><strong>{{signatoryName}}</strong></div>
      <div>{{signatoryDesignation}}</div>
    </div>
  </div>
</div>
`;

