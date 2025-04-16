// pages/StaffEvaluationNew.tsxの修正 - 暗黙的なany型の修正

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';
import evaluationService, {
  EvaluationDto,
  EvaluationSkillDto,
} from '../services/evaluationService';
import userService from '../services/userService';
import projectService from '../services/projectService';
import staffService from '../services/staffService';
import Alert from '../components/common/Alert';
import { Staff, Project, User } from '../shared-types';

// StaffEvaluationNewコンポーネント
const StaffEvaluationNew: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // データ取得用の状態
  const [staffs, setStaffs] = useState<Staff[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [evaluators, setEvaluators] = useState<User[]>([]);

  // フォームデータの状態
  const [evaluationData, setEvaluationData] = useState<EvaluationDto>({
    staffId: '',
    projectId: '',
    evaluatorId: '',
    evaluationDate: new Date().toISOString().split('T')[0],
    overallRating: 3,
    technicalSkills: 3,
    communicationSkills: 3,
    problemSolving: 3,
    teamwork: 3,
    leadership: 3,
    comments: '',
    skillRatings: [],
  });

  // スキル入力フィールドの状態
  const [skillName, setSkillName] = useState('');
  const [skillRating, setSkillRating] = useState(3);

  // データの初期読み込み
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [staffsData, projectsData, evaluatorsData] = await Promise.all([
          staffService.getStaffs(),
          projectService.getProjects(),
          userService.getUsers(),
        ]);

        setStaffs(staffsData);
        setProjects(projectsData);
        setEvaluators(evaluatorsData);
      } catch (err) {
        setError('データの読み込みに失敗しました');
        console.error(err);
      }
    };

    fetchData();
  }, []);

  // 入力フィールドの変更ハンドラ
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEvaluationData((prev: EvaluationDto) => ({
      ...prev,
      [name]: name.includes('Rating') ? parseInt(value) : value,
    }));
  };

  // スキル追加ハンドラ
  const handleAddSkill = () => {
    if (!skillName.trim()) return;

    setEvaluationData((prev: EvaluationDto) => ({
      ...prev,
      skillRatings: [...prev.skillRatings, { skillName, rating: skillRating }],
    }));

    // 入力フィールドをリセット
    setSkillName('');
    setSkillRating(3);
  };

  // スキル削除ハンドラ
  const handleRemoveSkill = (index: number) => {
    setEvaluationData((prev: EvaluationDto) => ({
      ...prev,
      skillRatings: prev.skillRatings.filter((_, i) => i !== index),
    }));
  };

  // フォーム送信ハンドラ
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await evaluationService.createEvaluation(evaluationData);
      setSuccess(true);

      // 成功後、一覧ページに戻る
      setTimeout(() => {
        navigate('/staff-evaluations');
      }, 2000);
    } catch (err) {
      setError('評価の登録に失敗しました');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="staff-evaluation-new-page">
      <h1>新規スタッフ評価</h1>

      {error && (
        <Alert type="error" className="mb-4">
          {error}
        </Alert>
      )}

      {success && (
        <Alert type="success" className="mb-4">
          評価が正常に登録されました。一覧ページに戻ります。
        </Alert>
      )}

      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>スタッフ</Form.Label>
              <Form.Select
                name="staffId"
                value={evaluationData.staffId}
                onChange={handleChange}
                required
              >
                <option value="">選択してください</option>
                {staffs.map(staff => (
                  <option key={staff.id} value={staff.id}>
                    {staff.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>プロジェクト</Form.Label>
              <Form.Select
                name="projectId"
                value={evaluationData.projectId}
                onChange={handleChange}
                required
              >
                <option value="">選択してください</option>
                {projects.map(project => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>評価者</Form.Label>
              <Form.Select
                name="evaluatorId"
                value={evaluationData.evaluatorId}
                onChange={handleChange}
                required
              >
                <option value="">選択してください</option>
                {evaluators.map(evaluator => (
                  <option key={evaluator.id} value={evaluator.id}>
                    {evaluator.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>評価日</Form.Label>
              <Form.Control
                type="date"
                name="evaluationDate"
                value={evaluationData.evaluationDate}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>

        <h3 className="mt-4">評価項目</h3>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>総合評価 ({evaluationData.overallRating})</Form.Label>
              <Form.Range
                name="overallRating"
                min="1"
                max="5"
                value={evaluationData.overallRating}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>技術スキル ({evaluationData.technicalSkills})</Form.Label>
              <Form.Range
                name="technicalSkills"
                min="1"
                max="5"
                value={evaluationData.technicalSkills}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>コミュニケーション ({evaluationData.communicationSkills})</Form.Label>
              <Form.Range
                name="communicationSkills"
                min="1"
                max="5"
                value={evaluationData.communicationSkills}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>問題解決能力 ({evaluationData.problemSolving})</Form.Label>
              <Form.Range
                name="problemSolving"
                min="1"
                max="5"
                value={evaluationData.problemSolving}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>チームワーク ({evaluationData.teamwork})</Form.Label>
              <Form.Range
                name="teamwork"
                min="1"
                max="5"
                value={evaluationData.teamwork}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>リーダーシップ ({evaluationData.leadership})</Form.Label>
              <Form.Range
                name="leadership"
                min="1"
                max="5"
                value={evaluationData.leadership}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mb-4">
          <Form.Label>コメント</Form.Label>
          <Form.Control
            as="textarea"
            name="comments"
            value={evaluationData.comments}
            onChange={handleChange}
            rows={4}
          />
        </Form.Group>

        <h3 className="mt-4">スキル評価</h3>

        <div className="skill-ratings mb-4">
          {evaluationData.skillRatings.map((skill, index) => (
            <div key={index} className="skill-rating-item d-flex align-items-center mb-2">
              <div className="flex-grow-1">
                <strong>{skill.skillName}</strong>: {skill.rating}
              </div>
              <Button variant="outline-danger" size="sm" onClick={() => handleRemoveSkill(index)}>
                削除
              </Button>
            </div>
          ))}

          {evaluationData.skillRatings.length === 0 && (
            <p className="text-muted">スキル評価がまだ追加されていません</p>
          )}
        </div>

        <Row className="mb-4">
          <Col md={5}>
            <Form.Control
              type="text"
              placeholder="スキル名"
              value={skillName}
              onChange={e => setSkillName(e.target.value)}
            />
          </Col>

          <Col md={4}>
            <div className="d-flex align-items-center">
              <Form.Range
                min="1"
                max="5"
                value={skillRating}
                onChange={e => setSkillRating(parseInt(e.target.value))}
                className="me-2"
              />
              <span>{skillRating}</span>
            </div>
          </Col>

          <Col md={3}>
            <Button variant="outline-primary" onClick={handleAddSkill} disabled={!skillName.trim()}>
              スキル追加
            </Button>
          </Col>
        </Row>

        <div className="d-flex justify-content-between mt-4">
          <Button variant="secondary" onClick={() => navigate('/staff-evaluations')}>
            キャンセル
          </Button>

          <Button type="submit" variant="primary" disabled={loading || success}>
            {loading ? '送信中...' : '評価を登録'}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default StaffEvaluationNew;
