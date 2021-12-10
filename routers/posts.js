const express = require('express');
const Posts = require('../schemas/posts');
const Comments = require('../schemas/comments');
const authMiddleware = require('../middlewares/auth-middleware');
const Join = require('../schemas/join');
const router = express.Router();

// 게시글 작성
router.post('/write', authMiddleware, async (req, res) => {
  const { userId, userName } = res.locals.user;
  const { title, subject, content, deadline_date, state } = req.body;
  const currentState = 1;
  let postId = await Posts.find({}).sort('-postId').limit(1);
  if (postId.length == 0) {
    postId = 1;
  } // 검색결과가 없으면 postId를 1로 설정
  else {
    postId = postId[0]['postId'] + 1;
  } //검색결과가 있으면 결과의 postId + 1 로 설정

  await Posts.create({
    postId,
    title,
    subject,
    userId,
    userName,
    content,
    deadline_date,
    currentState,
    state,
  });
  await Join.create({ postId, userId });
  res.send({ result: 'success' });
});

// 게시글 목록 보여주기
router.get('/post', async (req, res) => {
  try {
    const posts = await Posts.find({}).sort('-postId');
    res.json({ posts: posts });
  } catch (err) {}
});

// 게시글 수정페이지 로딩
router.get('/modify/:postId', authMiddleware, async (req, res) => {
  const { postId } = req.params;
  const post = await Posts.findOne({ postId: postId });

  res.json({ post });
});

// 게시글 수정하기
router.put('/modify/:postId', authMiddleware, async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId, userName } = res.locals.user;
    const { title, subject, content, deadline_date, state } = req.body;

    const eixstId = await Posts.find({ postId });

    if (eixstId.length !== 0) {
      await Posts.updateOne(
        { postId },
        {
          $set: {
            postId,
            title,
            subject,
            userId,
            userName,
            content,
            deadline_date,
            state,
          },
        }
      );
      res.send({ result: 'success' });
    }
  } catch (err) {
    res.status(401).send({
      errorMessage: '오류내용 : ' + err,
    });
  }
});

// 게시글 삭제하기
router.delete('/post/:postId', authMiddleware, async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId } = res.locals.user;
    const postsExist = await Posts.findOne({ postId, userId });
    const commentsExist = await Comments.findOne({ postId });

    if (postsExist && commentsExist) {
      await Comments.deleteMany({ postId });
      await Join.deleteMany({ postId });
      await Posts.deleteOne({ postId });
      res.send({ result: 'success' });
    } else if (postsExist) {
      await Join.deleteMany({ postId });
      await Posts.deleteOne({ postId });
      res.send({ result: 'success' });
    } else {
      res.send({ result: 'fail' });
    }
  } catch (err) {}
});

// 게시글 조회
router.get('/post/:postId', async (req, res) => {
  const { postId } = req.params;
  const post = await Posts.findOne({ postId });
  res.json(post);
});

// 참가 신청/취소
router.post('/join/:postId', authMiddleware, async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId } = res.locals.user;
    const joinExist = await Join.findOne({ postId, userId });
    let { currentState, state } = await Posts.findOne({ postId });

    if (!joinExist) {
      if (currentState >= state) {
        res.send({ result: 'full' });
      } else {
        await Join.create({ postId, userId });
        await Posts.updateOne(
          { postId },
          { $set: { currentState: currentState + 1 } }
        );
        res.send({ result: 'success' });
      }
    } else {
      console.log('요청 : 4');
      await Join.deleteOne({ postId, userId });
      await Posts.updateOne(
        { postId },
        { $set: { currentState: currentState - 1 } }
      );
      res.send({ result: 'cancle' });
    }
  } catch (err) {
    res.status(401).send({
      errorMessage: '오류내용 : ' + err,
    });
  }
});

// 참가 신청 내역 조회
router.get('/join/:postId', authMiddleware, async (req, res) => {
  const { postId } = req.params;
  const join = await Join.findOne({ postId: postId });

  res.json(join);
});

module.exports = router;
