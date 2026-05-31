# 수능 D-Day 캘린더

GitHub Pages에서 바로 구동할 수 있는 정적 D-Day 캘린더입니다. `data/events.json`에서 일정을 읽어와 상단에는 6월 모의평가, 9월 모의평가, 수능만 크게 보여주고, 아래에는 교육청 모의고사를 별도로 보여줍니다.

## 실행

```bash
python3 -m http.server 8000
```

브라우저에서 `http://localhost:8000`으로 접속합니다.

code-server에서는 포트 8000 알림의 `Open in Browser`를 누르거나 `/proxy/8000/` 주소로 접속하면 됩니다.

## 일정 수정

일정은 [data/events.json](./data/events.json)을 직접 수정합니다.

```json
{
  "id": "2026-suneung",
  "year": 2026,
  "type": "수능",
  "name": "2027학년도 대학수학능력시험",
  "date": "2026-11-19",
  "organizer": "한국교육과정평가원",
  "active": true
}
```

상단 핵심 일정에 표시되는 `type`은 `6모`, `9모`, `수능`입니다. 그 외 타입은 교육청 모의고사 영역에 표시됩니다.

`active`를 `false`로 바꾸면 화면에 표시하지 않습니다.
